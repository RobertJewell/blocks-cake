//  Dehydration (Runtime Objects -> Storage IDs)

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
      if (typeof item === "object" && item !== null && "id" in item) {
        return item.id;
      }
      if (typeof item === "string") {
        return item;
      }
      return null;
    })
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}
