import { create } from "zustand";
import {
  Block,
  BlockType,
  PageData,
  PropsOf,
} from "@/cms/blocks/block-registry.types";
import { registry } from "../blocks/block-registry";

export type ViewMode = "view" | "edit" | "add" | "edit-meta";

type EditorState = {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;

  // page
  page: PageData | null;
  setPage: (page: PageData) => void;

  editedBlocks: Set<string>;
  updateBlock: <T extends Block["type"]>(
    id: string,
    type: T,
    patch: Partial<PropsOf<T>>,
  ) => void;
  addBlock: (type: BlockType, insertAfterId: string) => void;
  deleteBlock: (id: string) => void;
  resetEditedBlocks: () => void;
  reorderBlocks: (blocks: Block[]) => void;
  resetPage: () => void;
  resetBlock: (id: string) => void;

  // initial page
  initialPage: PageData | null;
  setInitialPage: (page: PageData) => void;

  // currently selected block
  selectedBlockId?: string;
  setSelected: (id?: string) => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  mode: "view",
  setMode: (mode) => set({ mode, selectedBlockId: undefined }),

  // page
  page: null,
  setPage: (page) => set({ page }),
  editedBlocks: new Set(),

  updateBlock: (id, type, patch) =>
    set((s) => {
      if (!s.page) return {};

      const updatedBlocks = s.page.blocks.map((b) =>
        b.id === id && isBlockType(b, type) ? mergeData(b, patch) : b,
      );

      const editedBlocks = new Set(s.editedBlocks);
      editedBlocks.add(id);

      return {
        page: { ...s.page, blocks: updatedBlocks },
        editedBlocks,
      };
    }),
  addBlock: (type, insertAfterId) =>
    set((s) => {
      if (!s.page) return {};

      // 1. Create the new block structure
      const newBlock = {
        id: crypto.randomUUID(),
        type,
        data: registry[type].defaultValues,
      } as Block;

      // 2. Find insertion index
      const index = s.page.blocks.findIndex((b) => b.id === insertAfterId);
      if (index === -1) return {};

      // 3. Insert into array
      const newBlocks = [...s.page.blocks];
      newBlocks.splice(index + 1, 0, newBlock);

      // 4. Mark as edited
      const editedBlocks = new Set(s.editedBlocks);
      editedBlocks.add(newBlock.id);

      return {
        page: { ...s.page, blocks: newBlocks },
        editedBlocks,
        // Auto-select the new block and switch back to edit mode
        selectedBlockId: newBlock.id,
        mode: "edit",
      };
    }),
  deleteBlock: (id) =>
    set((s) => {
      if (!s.page) return {};

      // 1. Filter out the block
      const newBlocks = s.page.blocks.filter((b) => b.id !== id);

      // 2. If the deleted block was selected, deselect it (returns user to List view)
      const selectedBlockId =
        s.selectedBlockId === id ? undefined : s.selectedBlockId;

      return {
        page: { ...s.page, blocks: newBlocks },
        selectedBlockId,
      };
    }),

  reorderBlocks: (blocks) =>
    set((s) => {
      if (!s.page) return {};
      return {
        page: { ...s.page, blocks },
      };
    }),

  resetEditedBlocks: () => set({ editedBlocks: new Set() }),

  resetPage: () => {
    const initialPage = get().initialPage;
    if (initialPage) {
      set({
        page: initialPage,
        editedBlocks: new Set(),
        selectedBlockId: undefined,
      });
    }
  },

  resetBlock: (id) => {
    const initialPage = get().initialPage;
    const page = get().page;
    if (!initialPage || !page) return;

    const initialBlock = initialPage.blocks.find((b) => b.id === id);
    if (!initialBlock) return;

    const updatedBlocks = page.blocks.map((b) =>
      b.id === id ? initialBlock : b,
    );

    const editedBlocks = new Set(get().editedBlocks);
    editedBlocks.delete(id);

    set({
      page: { ...page, blocks: updatedBlocks },
      editedBlocks,
    });
  },

  initialPage: null,
  setInitialPage: (page) => set({ initialPage: page }),

  setSelected: (id) => {
    set({ selectedBlockId: id });
    scrollToId(id);
  },
}));

// --- Helpers ---

export const isBlockType = <T extends Block["type"]>(
  b: Block,
  type: T,
): b is Extract<Block, { type: T }> => b.type === type;

const mergeData = <T extends Block["type"]>(
  b: Extract<Block, { type: T }>,
  patch: Partial<PropsOf<T>>,
): Extract<Block, { type: T }> => ({
  ...b,
  data: { ...b.data, ...patch },
});

function scrollToId(id?: string) {
  if (!id) return;
  setTimeout(() => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center", // Scrolls the element to the center of the viewport
      });
    }
  }, 0);
}
