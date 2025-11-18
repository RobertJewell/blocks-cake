import { defineBlock } from "./block-builder";
import { HeroComponent, heroConfig } from "./hero";
import { RichTextComponent } from "./rich-text/rich-text-component";
import { richTextFields } from "./rich-text/rich-text-config";

export const registry = {
  hero: defineBlock({
    type: "hero",
    fields: heroConfig,
    component: HeroComponent,
  }),

  richText: defineBlock({
    type: "richtext",
    fields: richTextFields,
    component: RichTextComponent,
  }),
} as const;

export type Registry = typeof registry;
