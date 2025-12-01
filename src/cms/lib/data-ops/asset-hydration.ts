import { Asset } from "@/cms/blocks/shared/assets/asset-schema";

// Base URL for assets - this could be pulled from an environment variable
const ASSET_BASE_URL = "https://pub-39814712f705425ebdcd406e6d0a9361.r2.dev";

// --- 2. Dehydration (Runtime Objects -> Storage IDs) ---

/**
 * Converts Runtime Asset objects (or mixed data) into Storage IDs (UUID strings).
 * Used when saving blocks to the database to ensure we only store references.
 *
 * @param data - The raw data from the form (could be Asset[], string[], or mixed)
 * @returns An array of UUID strings
 */
export function dehydrateAssets(data: unknown): string[] {
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => {
      // Case A: It's a full Asset object (from the frontend state)
      if (typeof item === "object" && item !== null && "id" in item) {
        return item.id;
      }
      // Case B: It's already a string UUID (legacy or pre-processed)
      if (typeof item === "string") {
        return item;
      }
      return null;
    })
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

// --- 3. Hydration (Storage IDs -> Runtime Objects) ---

/**
 * Converts Storage IDs (UUID strings) into Runtime Asset objects.
 * Used when loading pages to display in the editor/frontend.
 *
 * @param ids - Array of asset UUIDs stored in the block data
 * @param lookup - A function or Map to find the asset details (e.g., from DB relations)
 */
export function hydrateAssets(
  ids: string[] | undefined | null,
  lookup: (id: string) => Partial<Asset> | undefined,
): Asset[] {
  if (!ids || !Array.isArray(ids)) return [];

  return ids
    .map((id) => {
      const details = lookup(id);

      // If we have details from the DB, use them.
      // If not, we might return a minimal object if the ID exists but DB row is missing (rare),
      // or filter it out. Here we construct a fallback URL assuming standard naming.
      if (!details) {
        // Option: Return a "broken" asset or filter it out.
        // Let's return a minimal object assuming the ID is the key (per your UUIDv7 setup)
        return {
          id,
          url: `${ASSET_BASE_URL}/${id}`,
          filename: "Unknown Asset",
          width: 0,
          height: 0,
        } as Asset;
      }

      return {
        id,
        // Prefer optimized/variant URL if logic exists in lookup, otherwise default construction
        url: details.url || `${ASSET_BASE_URL}/${id}`,
        filename: details.filename || "Asset",
        alt: details.alt || null,
        blurhash: details.blurhash || null,
        width: details.width || 0,
        height: details.height || 0,
      } as Asset;
    })
    .filter((a): a is Asset => a !== null);
}
