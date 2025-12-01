import { createSchema, fields } from "../block-builder";

export const simpleCardConfig = {
  heading: fields.text("Heading", { min: 1 }),
  subheading: fields.text("Subheading", { optional: true }),
  description: fields.text("Description"),
  ctaText: fields.text("Call to Action Text", { optional: true }),
  ctaHref: fields.text("Link URL", { optional: true }),
  image: fields.image("Image", { max: 1, optional: true }),
};

export const SimpleCardCardSchema = createSchema(simpleCardConfig);
