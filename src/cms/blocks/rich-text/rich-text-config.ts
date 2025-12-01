import { createSchema, fields } from "../block-builder";

export const richTextConfig = {
  content: fields.richtext("Content"),
};

export const RichTextSchema = createSchema(richTextConfig);
