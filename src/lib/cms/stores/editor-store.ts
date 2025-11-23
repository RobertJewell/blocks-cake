import { create } from "zustand";
import {
  Block,
  PageData,
  PropsOf,
} from "@/lib/cms/blocks/block-registry.types";

type EditorState = {
  mode: "view" | "edit" | "edit-meta";
  setMode: (mode: "view" | "edit" | "edit-meta") => void;

  // page
  page: PageData | null;
  setPage: (page: PageData) => void;

  editedBlocks: Set<string>;

  updateBlock: <T extends Block["type"]>(
    id: string,
    type: T,
    patch: Partial<PropsOf<T>>,
  ) => void;

  resetEditedBlocks: () => void;
  resetPage: () => void;
  resetBlock: (id: string) => void;
  reorderBlocks: (blocks: Block[]) => void;

  // initial page
  initialPage: PageData | null;
  setInitialPage: (page: PageData) => void;

  // currently selected block
  selectedBlockId?: string;
  setSelected: (id?: string) => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  mode: "view",
  setMode: (mode) => set({ mode }),

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

  setSelected: (id) => set({ selectedBlockId: id }),
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
