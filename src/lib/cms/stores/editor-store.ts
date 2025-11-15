import { create } from "zustand";
import { Block, PageData, PropsOf } from "../blocks/block-registry.types";

type EditorState = {
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;

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

  // initial page
  initialPage: PageData | null;
  setInitialPage: (page: PageData) => void;

  // currently selected block
  selectedBlockId?: string;
  setSelected: (id?: string) => void;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  mode: "edit",
  setMode: (mode) => set({ mode }),

  // page
  page: null,
  setPage: (page) => set({ page }),
  editedBlocks: new Set(),

  updateBlock: (id, type, patch) =>
    set((s) => {
      if (!s.page) return {};
      const updatedBlocks = s.page.blocks.map((b) =>
        b.id === id && isBlockType(b, type) ? mergeProps(b, patch) : b,
      );

      // clone the Set to avoid mutating state directly
      const editedBlocks = new Set(s.editedBlocks);
      editedBlocks.add(id);

      return {
        page: { ...s.page, blocks: updatedBlocks },
        editedBlocks,
      };
    }),

  resetEditedBlocks: () => set({ editedBlocks: new Set() }),

  resetPage: () => {
    const initialPage = get().initialPage;
    console.log(initialPage);
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

    const updatedBlocks = page.blocks.map((b) => (b.id === id ? initialBlock : b));

    // remove the block from editedBlocks
    const editedBlocks = new Set(get().editedBlocks);
    editedBlocks.delete(id);

    set({
      page: { ...page, blocks: updatedBlocks },
      editedBlocks,
    });
  },

  // initial page
  initialPage: null,
  setInitialPage: (page) => set({ initialPage: page }),

  // currently selected block
  setSelected: (id) => set({ selectedBlockId: id }),
}));

// type helpers

export const isBlockType = <T extends Block["type"]>(
  b: Block,
  type: T,
): b is Extract<Block, { type: T }> => b.type === type;

const mergeProps = <T extends Block["type"]>(
  b: Extract<Block, { type: T }>,
  patch: Partial<PropsOf<T>>,
): Extract<Block, { type: T }> => ({ ...b, props: { ...b.props, ...patch } });
