import { fields } from "../block-builder";

export const simpleCardConfig = {
  heading: fields.text("Heading", { min: 1 }),
  subheading: fields.text("Subheading", { optional: true }),
  description: fields.text("Description"),
  image: fields.image("Image", { max: 1, optional: true }),

  ctaText: fields.text("Call to Action Text", {
    optional: true,
    group: "Action",
  }),
  ctaHref: fields.text("Link URL", { optional: true, group: "Action" }),

  maxWidth: fields.text("Max Width", { optional: true, group: "Style" }),
};
