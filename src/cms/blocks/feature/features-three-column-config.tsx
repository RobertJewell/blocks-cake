import { fields } from "../block-builder";

export const featuresThreeColumnConfig = {
  heading: fields.text("Heading", { min: 1 }),
  subheading: fields.text("Subheading", { optional: true }),
  description: fields.text("Description"),

  features: fields.repeater("Features", {
    max: 3,
    group: "Features",
    fields: {
      heading: fields.text("Heading", { min: 1 }),
      description: fields.text("Description"),

      ctaText: fields.text("Call to Action Text", {
        optional: true,
      }),
      ctaHref: fields.text("Link URL", { optional: true }),
    },
  }),
};
