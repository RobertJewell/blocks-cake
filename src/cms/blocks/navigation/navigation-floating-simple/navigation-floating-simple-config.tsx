import { fields } from "../../block-builder";

export const navigationFloatingSimpleConfig = {
  logo: fields.image("Logo", { max: 1, optional: true }),

  ctaText: fields.text("Call to Action Text", {
    optional: true,
    group: "Action",
  }),
  ctaHref: fields.text("Link URL", { optional: true, group: "Action" }),

  menuItems: fields.repeater("Navigation Links", {
    max: 6,
    optional: true,
    group: "Links",
    fields: {
      text: fields.text("Call to Action Text"),
      href: fields.text("Link URL", { optional: true }),
      subMenuItems: fields.repeater("Sub Links", {
        optional: true,
        fields: {
          text: fields.text("Call to Action Text", {}),
          href: fields.text("Link URL"),
        },
      }),
    },
  }),
};
