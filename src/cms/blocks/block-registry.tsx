import { defineBlock } from "./block-builder";
import { BlockDefinitionResult } from "./block-registry.types";
import { SimpleCard, simpleCardConfig, SimpleCardSkeleton } from "./card";
import { featuresThreeColumn } from "./feature";
import { FeaturesThreeColumn } from "./feature/features-three-column";
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
    nameKey: "heading",
    defaultValues: {
      heading: "A Hero Banner",
      subheading: "Subtitle",
      ctaText: "Click Here",
      ctaHref: "",
      leftImage: [],
      rightImage: [],
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

  simpleCard: defineBlock({
    name: "Simple card",
    category: "cards",
    fields: simpleCardConfig,
    component: SimpleCard,
    skeleton: SimpleCardSkeleton,

    defaultValues: {
      heading: "Lorem Ipsum",
      subheading: "",
      description:
        "Duis pariatur ex fugiat Lorem anim ullamco aliqua amet sit exercitation",
      ctaText: "",
      ctaHref: "",
      image: [],
      maxWidth: "",
      reverse: false,
    },
  }),
  featuresThreeColumn: defineBlock({
    name: "Three Column",
    category: "features",
    fields: featuresThreeColumn,
    component: FeaturesThreeColumn,
    skeleton: SimpleCardSkeleton,

    defaultValues: {
      heading: "Lorem Ipsum",
      subheading: "",
      description:
        "Duis pariatur ex fugiat Lorem anim ullamco aliqua amet sit exercitation",
      features: [],
    },
  }),
} satisfies Record<string, BlockDefinitionResult>;
