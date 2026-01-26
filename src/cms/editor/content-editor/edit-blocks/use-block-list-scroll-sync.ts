import { useEffect, useRef } from "react";

interface UseBlockListScrollSyncProps {
  blocks: { id: string }[] | undefined;
  inViewBlocks: Record<string, boolean>;
  isDragging: boolean;
}

export function useBlockListScrollSync({
  blocks,
  inViewBlocks,
  isDragging,
}: UseBlockListScrollSyncProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);

  const prevFirstVisibleIndex = useRef<number>(-1);
  const prevLastVisibleIndex = useRef<number>(-1);

  useEffect(() => {
    // Guard: Don't auto-scroll if user is hovering or dragging or no blocks
    if (isHoveringRef.current || isDragging || !blocks) return;

    // Get all currently visible block IDs
    const visibleBlockIds = blocks
      .filter((b) => inViewBlocks[b.id])
      .map((b) => b.id);

    if (visibleBlockIds.length === 0) return;

    // Calculate Current Indices
    const firstVisibleId = visibleBlockIds[0];
    const lastVisibleId = visibleBlockIds[visibleBlockIds.length - 1];

    const currentFirstIndex = blocks.findIndex((b) => b.id === firstVisibleId);
    const currentLastIndex = blocks.findIndex((b) => b.id === lastVisibleId);

    // If the current last index is greater than the previous last index,
    // it means a new block has entered the viewport from the bottom.
    const isExpandingDownwards =
      currentLastIndex > prevLastVisibleIndex.current;

    // Update refs for next render
    // Honestly don't love this apprach, it's possible to fail to catch the last block on fast scrolls, not a big deal but irritating.
    prevFirstVisibleIndex.current = currentFirstIndex;
    prevLastVisibleIndex.current = currentLastIndex;

    const targetId = isExpandingDownwards ? lastVisibleId : firstVisibleId;
    const sidebarElement = document.getElementById(`sidebar-item-${targetId}`);
    const isLastBlockInList = targetId === blocks[blocks.length - 1].id;

    if (sidebarElement) {
      sidebarElement.scrollIntoView({
        behavior: "smooth",
        // Force 'end' alignment if we are scrolling down OR it's the last block.
        // This ensures the new item entering the bottom isn't hidden by the sidebar's bottom edge.
        block: isExpandingDownwards || isLastBlockInList ? "end" : "nearest",
      });
    }
  }, [inViewBlocks, blocks, isDragging]);

  return {
    scrollContainerRef,
    onMouseEnter: () => {
      isHoveringRef.current = true;
    },
    onMouseLeave: () => {
      isHoveringRef.current = false;
    },
  };
}
