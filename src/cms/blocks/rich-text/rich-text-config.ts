import { createSchema, fields, BlockConfigSchema } from "../block-builder";

export const richTextConfig: BlockConfigSchema = [
  {
    label: "Content",
    fields: {
      content: fields.richtext("Content"),
    },
  },
];

export const RichTextSchema = createSchema(richTextConfig);
