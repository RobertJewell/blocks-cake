import { BlockDefinitionResult, defineBlock } from "./block-builder";
import { HeroComponent, heroConfig, HeroSkeleton } from "./hero";
import {
  RichTextComponent,
  richTextConfig,
  RichTextSkeleton,
} from "./rich-text";

export const registry = {
  hero: defineBlock({
    fields: heroConfig,
    component: HeroComponent,
    skeleton: HeroSkeleton,
  }),

  richtext: defineBlock({
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
