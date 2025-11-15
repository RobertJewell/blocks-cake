import { defineEntry } from "./block-registry.types";
import { Hero } from "./hero/hero-block";
import { RichTextBlock } from "./rich-text/rich-text";

export type FieldTypeMap = {
  text: string;
  image: string;
  richtext: string;
};

export const registry = {
  hero: defineEntry(Hero, {
    heading: { type: "text", label: "Heading" },
    subheading: { type: "text", label: "Subheading" },
    ctaText: { type: "text", label: "Call to action text" },
    ctaHref: { type: "text", label: "Call to action link" },
    leftImage: { type: "image", label: "Left Image" },
    rightImage: { type: "image", label: "Right Image" },
  }),

  richText: defineEntry(RichTextBlock, {
    content: { type: "richtext", label: "Content" },
  }),
} as const;

export type Registry = typeof registry;
