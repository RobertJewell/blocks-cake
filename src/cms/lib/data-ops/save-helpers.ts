import { registry } from "@/cms/blocks/block-registry";
import { Block, BlockType } from "@/cms/blocks/block-registry.types";
import { Asset } from "@/cms/blocks/shared/assets/asset-schema";

/**
 * Helper: Converts Runtime Data (Asset Objects) -> DB Data (UUID Strings)
 * It looks at the Block Definition to know which fields to convert.
 */
function dehydrateBlockData(type: BlockType, data: any) {
  const def = registry[type];
  if (!def) return data;

  // Clone data to avoid mutating the original reference
  const cleanData = { ...data };

  // Iterate over the field definitions for this block
  Object.entries(def.fields).forEach(([key, fieldDef]) => {
    const value = cleanData[key];

    // If this field is an 'image' type, we expect an array of Assets (or strings)
    // We want to save ONLY the IDs to the database.
    if (fieldDef.type === "image" && Array.isArray(value)) {
      cleanData[key] = value
        .map((item: Asset | string) => {
          // Case A: It's an Asset Object (from frontend) -> Extract ID
          if (typeof item === "object" && item !== null && "id" in item) {
            return item.id;
          }
          // Case B: It's already a string ID (edge case) -> Keep it
          if (typeof item === "string") {
            return item;
          }
          return null;
        })
        .filter((id) => typeof id === "string" && id.length > 0);
    }
  });

  return cleanData;
}

/**
 * Helper: Extracts asset IDs to populate the 'asset_usages' table.
 * This runs against the VALIDATED runtime data.
 */
function extractAssetReferences(
  type: BlockType,
  data: Record<string, any>,
): { field: string; assetId: string }[] {
  const refs: { field: string; assetId: string }[] = [];
  const def = registry[type];
  if (!def) return refs;

  Object.entries(def.fields).forEach(([fieldName, fieldDef]) => {
    // Check if this field allows images
    if (fieldDef.type === "image") {
      const value = data[fieldName];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          // We support extracting from both Objects (Runtime) and Strings (Storage)
          // just to be safe, though usually this runs on Runtime data.
          if (typeof item === "object" && item?.id) {
            refs.push({ field: fieldName, assetId: item.id });
          } else if (typeof item === "string") {
            refs.push({ field: fieldName, assetId: item });
          }
        });
      }
    }
  });

  return refs;
}

/**
 * MAIN UTILITY
 * Takes raw blocks from the frontend, validates them, dehydrates them,
 * and prepares everything for the database transaction.
 */
export function processBlocksForSave(rawBlocks: Block[]) {
  const validBlocks: any[] = [];
  const usageRecords: { blockId: string; assetId: string; field: string }[] =
    [];
  const blockIdsToDeleteUsagesFor: string[] = [];

  rawBlocks.forEach((b) => {
    const def = registry[b.type];
    if (!def) throw new Error(`Unknown block type: ${b.type}`);

    // 1. VALIDATE (Runtime Check)
    // We validate against the schema defined in block-builder (which expects Asset[])
    // This ensures the frontend sent us valid objects.
    const parseResult = def.schema.safeParse(b.data);

    if (!parseResult.success) {
      console.error(`Validation failed for block ${b.id}`, parseResult.error);
      throw new Error(`Invalid data for block type: ${b.type}`);
    }

    const runtimeData = parseResult.data;

    // 2. DEHYDRATE (Prepare for DB)
    // Convert { image: [{id: "..."}] } -> { image: ["..."] }
    const dbData = dehydrateBlockData(b.type, runtimeData);

    // 3. PREPARE BLOCK ROW
    validBlocks.push({
      id: b.id,
      type: b.type,
      data: dbData, // We save the Clean IDs JSON
      updatedAt: new Date(),
    });

    // 4. EXTRACT REFERENCES
    // We track which blocks we are processing so we can clear their old usage records
    blockIdsToDeleteUsagesFor.push(b.id);

    // Extract usages from the runtime data
    const refs = extractAssetReferences(b.type, runtimeData);
    refs.forEach((ref) => {
      usageRecords.push({
        blockId: b.id,
        assetId: ref.assetId,
        field: ref.field,
      });
    });
  });

  return {
    validBlocks,
    usageRecords,
    blockIdsToDeleteUsagesFor,
  };
}
