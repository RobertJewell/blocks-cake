import { fields } from "../block-builder";

export const heroConfig = {
  heading: fields.text("Heading", { min: 1 }),
  subheading: fields.text("Subheading"),

  leftImage: fields.image("Left Image", { max: 1, group: "Media" }),
  rightImage: fields.image("Right Image", { max: 1, group: "Media" }),

  ctaText: fields.text("Call to Action Text", { group: "Navigation" }),
  ctaHref: fields.text("Link URL", { group: "Navigation" }),
};
