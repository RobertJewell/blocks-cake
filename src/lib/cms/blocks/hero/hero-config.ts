import { createSchema, fields } from "../block-builder";

export const heroConfig = {
  heading: fields.text("Heading", { min: 1 }),
  subheading: fields.text("Subheading"),
  ctaText: fields.text("Call to Action Text"),
  ctaHref: fields.text("Link URL"),
  leftImage: fields.image("Left Image", { max: 1 }),
  rightImage: fields.image("Right Image", { max: 1 }),
};

export const HeroSchema = createSchema(heroConfig);
