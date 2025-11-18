import { createSchema, fields } from "../block-builder";

export const heroConfig = {
  heading: fields.text("Heading", { min: 1 }),
  subheading: fields.text("Subheading"),
  ctaText: fields.text("Call to Action Text"),
  ctaHref: fields.text("Link URL"),
  leftImage: fields.image("Left Image"),
  rightImage: fields.image("Right Image"),
};

export const HeroSchema = createSchema(heroConfig);
