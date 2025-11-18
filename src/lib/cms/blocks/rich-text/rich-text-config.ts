import { createSchema, fields } from "../block-builder";

export const richTextFields = {
  content: fields.richtext("Content"),
};

export const RichTextSchema = createSchema(richTextFields);
