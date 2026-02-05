import { fields } from "../block-builder";

export const featureThreeColumn = {
  heading: fields.text("Heading", { min: 1 }),
  subheading: fields.text("Subheading", { optional: true }),
  description: fields.text("Description"),
  ctaText: fields.text("Call to Action Text", {
    optional: true,
  }),
  ctaHref: fields.text("Link URL", { optional: true }),

  image: fields.image("Image", { max: 1, optional: true }),

  maxWidth: fields.text("Max Width", { optional: true, group: "Style" }),
};
