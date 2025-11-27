import { BlockDefinitionResult, defineBlock } from "./block-builder";
import { HeroComponent, heroConfig, HeroSkeleton } from "./hero";
import {
  RichTextComponent,
  richTextConfig,
  RichTextSkeleton,
} from "./rich-text";

export const registry = {
  hero: defineBlock({
    name: "Hero with 2 images",
    category: "Heros",
    fields: heroConfig,
    component: HeroComponent,
    skeleton: HeroSkeleton,
  }),

  richtext: defineBlock({
    name: "Rich Text",
    fields: richTextConfig,
    component: RichTextComponent,
    skeleton: RichTextSkeleton,
  }),

  // theseshouldmatch: defineBlock({
  //   fields: richTextConfig,
  //   component: RichTextComponent,
  //   skeleton: RichTextSkeleton,
  // }),
} satisfies Record<string, BlockDefinitionResult>;

export type Registry = typeof registry;
