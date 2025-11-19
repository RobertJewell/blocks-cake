import { defineBlock } from "./block-builder";
import { HeroComponent, heroConfig } from "./hero";
import { RichTextComponent, richTextConfig } from "./rich-text";

export const registry = {
  hero: defineBlock({
    type: "hero",
    fields: heroConfig,
    component: HeroComponent,
  }),

  richtext: defineBlock({
    type: "richtext",
    fields: richTextConfig,
    component: RichTextComponent,
  }),
};

export type Registry = typeof registry;
