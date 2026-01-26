import { useMemo } from "react";
import { registry } from "../../block-registry";
import { BlockDefinitionResult, BlockType } from "../../block-registry.types";

export type BlockLibraryItem = {
  type: BlockType;
  def: BlockDefinitionResult;
};

export type BlockGroup = {
  category: string;
  items: BlockLibraryItem[];
};

export function useBlockCategories(searchQuery: string = ""): BlockGroup[] {
  return useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase().trim();

    // 1. Filter the registry entries
    const filteredEntries = Object.entries(registry).filter(([type, def]) => {
      if (!lowerQuery) return true; // No search? Return all.

      return (
        def.name.toLowerCase().includes(lowerQuery) ||
        type.toLowerCase().includes(lowerQuery) ||
        (def.category && def.category.toLowerCase().includes(lowerQuery))
      );
    });

    // 2. Group by Category
    const groups: Record<string, BlockLibraryItem[]> = {};

    filteredEntries.forEach(([type, def]) => {
      const category = def.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push({
        type: type as BlockType,
        def,
      });
    });

    // 3. Convert to Array and Sort
    // We sort categories alphabetically, but you can add custom logic here
    // (e.g., forcing "Heros" to be first).
    return Object.entries(groups)
      .sort(([catA], [catB]) => catA.localeCompare(catB))
      .map(([category, items]) => ({
        category,
        items,
      }));
  }, [searchQuery]);
}
