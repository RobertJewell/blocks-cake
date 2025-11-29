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
    defaultValues: {
      heading: "A Hero Banner",
      subheading: "Subtitle",
      ctaText: "Click Here",
      ctaHref: "",
      leftImage: undefined,
      rightImage: undefined,
    },
  }),

  richtext: defineBlock({
    name: "Rich Text",
    category: "Rich Text",
    fields: richTextConfig,
    component: RichTextComponent,
    skeleton: RichTextSkeleton,
    defaultValues: {
      content:
        "<h1>Lorem Ipsum</h1><p>Duis pariatur ex fugiat Lorem anim ullamco aliqua amet sit exercitation reprehenderit voluptate enim adipisicing. Nisi consectetur ullamco veniam ullamco ex amet. Cupidatat exercitation nulla commodo eu consectetur officia nostrud ut nulla. Fugiat nulla laboris ad anim id qui labore ad deserunt occaecat. Ad dolor magna sunt culpa irure anim ea cillum.</p>",
    },
  }),

  // theseshouldmatch: defineBlock({
  //   fields: richTextConfig,
  //   component: RichTextComponent,
  //   skeleton: RichTextSkeleton,
  // }),
} satisfies Record<string, BlockDefinitionResult>;

export type Registry = typeof registry;
