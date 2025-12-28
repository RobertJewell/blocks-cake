import { BlockConfigSchema, createSchema, fields } from "../block-builder";

export const simpleCardConfig: BlockConfigSchema = [
  {
    label: "Content",
    fields: {
      heading: fields.text("Heading", { min: 1 }),
      subheading: fields.text("Subheading", { optional: true }),
      description: fields.text("Description"),
      image: fields.image("Image", { max: 1, optional: true }),
    },
  },
  {
    label: "Action",
    fields: {
      ctaText: fields.text("Call to Action Text", { optional: true }),
      ctaHref: fields.text("Link URL", { optional: true }),
    },
  },
  {
    label: "Style",
    fields: {
      maxWidth: fields.text("Max Width", { optional: true }),
    },
  },
] satisfies BlockConfigSchema;

export const SimpleCardCardSchema = createSchema(simpleCardConfig);
