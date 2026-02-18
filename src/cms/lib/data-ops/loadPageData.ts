import { DrizzleDB } from "@/cms/lib/core/db/drizzle";
import { registry } from "@/cms/blocks/block-registry";
import { Block } from "@/cms/blocks/block-registry.types";
import { Asset } from "@/cms/blocks/shared/assets/asset-schema";

export async function loadPageData(
  db: DrizzleDB,
  options: { slug: string; requirePublished: boolean },
) {
  // Fetch Page -> Join PageBlocks -> Join Blocks -> Join Usages -> Join Assets
  const pageData = await db.query.pages.findFirst({
    where: (p, { eq }) => eq(p.slug, options.slug),
    with: {
      pageBlocks: {
        orderBy: (pageBlocks, { asc }) => [asc(pageBlocks.order)], // Ensure blocks are sorted
        with: {
          block: {
            with: {
              usages: {
                with: {
                  asset: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Handle 404 / Unpublished
  if (
    !pageData ||
    (options.requirePublished && pageData.status !== "published")
  ) {
    return null;
  }

  // Loop through blocks and swap "UUID Strings" for "Asset Objects"
  const hydratedBlocks = pageData.pageBlocks.map((row) => {
    const block = row.block;
    const def = registry[block.type];

    // Default data contains strings: { gallery: ["uuid-1", "uuid-2"] }
    const hydratedData = { ...block.data } as Record<string, any>;

    // If we have usages, create a quick lookup map (AssetID -> DBAsset)
    const assetMap = new Map<string, Asset>();
    if (block.usages) {
      block.usages.forEach((u) => {
        if (u.asset) assetMap.set(u.assetId, u.asset);
      });
    }

    // Iterate through the block definition to find Asset fields
    if (def) {
      Object.entries(def.fields).forEach(([key, fieldDef]) => {
        if (fieldDef.type === "image" || fieldDef.type === "gallery") {
          // Get the array of IDs (e.g. ["uuid-1"]) from the raw JSON
          const rawIds: string[] = hydratedData[key];
          hydratedData[key] = rawIds
            .map((id) => assetMap.get(id))
            .filter((a): a is Asset => a !== null);
        }
      });
    }
    return {
      id: block.id,
      type: block.type,
      data: hydratedData,
    } as Block;
  });

  return {
    id: pageData.id,
    title: pageData.title,
    slug: pageData.slug,
    status: pageData.status,
    updatedAt: pageData.updatedAt,
    blocks: hydratedBlocks,
  };
}
