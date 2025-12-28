import { createSchema, fields, BlockConfigSchema } from "../block-builder";

export const heroConfig: BlockConfigSchema = [
  {
    label: "Content",
    fields: {
      heading: fields.text("Heading", { min: 1 }),
      subheading: fields.text("Subheading"),
    },
  },
  {
    label: "Media",
    fields: {
      leftImage: fields.image("Left Image", { max: 1 }),
      rightImage: fields.image("Right Image", { max: 1 }),
    },
  },
  {
    label: "Navigation",
    fields: {
      ctaText: fields.text("Call to Action Text"),
      ctaHref: fields.text("Link URL"),
    },
  },
];

export const HeroSchema = createSchema(heroConfig);
