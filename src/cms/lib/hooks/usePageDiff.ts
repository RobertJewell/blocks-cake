import { PageData } from "@/cms/blocks/block-registry.types";
import { useMemo } from "react";

// Fast hash function for change detection
function hashPage(data: any): number {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

export interface PageDiffResult {
  hasChanges: boolean;
  changedBlockIds: string[];
}

/**
 * Efficiently detects page changes and returns both the diff boolean and changed block IDs
 * Uses a single useMemo to avoid duplicate hashing
 */
export function usePageDiffWithIds(
  page: PageData | null,
  initialPage: PageData | null,
): PageDiffResult {
  return useMemo(() => {
    if (!page || !initialPage) {
      return { hasChanges: false, changedBlockIds: [] };
    }

    const changedIds = new Set<string>();

    // Track initial blocks by ID for quick lookup
    const initialBlockMap = new Map(
      initialPage.blocks.map((block) => [block.id, block]),
    );

    // Check for modified or added blocks
    page.blocks.forEach((block) => {
      const initialBlock = initialBlockMap.get(block.id);

      if (!initialBlock) {
        // Block was added
        changedIds.add(block.id);
      } else if (hashPage(block) !== hashPage(initialBlock)) {
        // Block was modified
        changedIds.add(block.id);
      }
    });

    // Check for removed blocks
    initialPage.blocks.forEach((block) => {
      if (!page.blocks.find((b) => b.id === block.id)) {
        changedIds.add(block.id);
      }
    });

    // Check if blocks were reordered
    const currentOrder = page.blocks.map((b) => b.id).join("|");
    const initialOrder = initialPage.blocks.map((b) => b.id).join("|");
    if (currentOrder !== initialOrder) {
      // All blocks are considered changed if order changed
      page.blocks.forEach((block) => changedIds.add(block.id));
    }

    return {
      hasChanges: changedIds.size > 0,
      changedBlockIds: Array.from(changedIds),
    };
  }, [page, initialPage]);
}

/**
 * Detects if a page has changed from its initial state using fast hash comparison
 * Returns true if there are differences, false if they match
 * @deprecated Use usePageDiffWithIds instead for better performance
 */
export function usePageDiff(
  page: PageData | null,
  initialPage: PageData | null,
): boolean {
  const { hasChanges } = usePageDiffWithIds(page, initialPage);
  return hasChanges;
}

/**
 * Extracts IDs of blocks that have changed between current and initial page
 * Includes blocks that were added, removed, or modified
 * @deprecated Use usePageDiffWithIds instead for better performance
 */
export function useChangedBlockIds(
  page: PageData | null,
  initialPage: PageData | null,
): string[] {
  const { changedBlockIds } = usePageDiffWithIds(page, initialPage);
  return changedBlockIds;
}
