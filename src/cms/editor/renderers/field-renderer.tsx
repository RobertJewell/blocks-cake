import { FieldTypeMap } from "@/cms/blocks/block-registry.types";
import { ImageDropzone } from "@/cms/ui/file-uploads/image-dropzone";
import { Input } from "@/cms/ui/input";
import { MinimalTiptapEditor } from "@/cms/ui/minimal-tiptap";
import { Textarea } from "@/cms/ui/textarea";
import { ReactNode } from "react";
import { ControllerRenderProps, Path } from "react-hook-form";

type RendererProps<T extends keyof FieldTypeMap> = {
  field: ControllerRenderProps<
    Record<string, FieldTypeMap[T]>,
    Path<Record<string, FieldTypeMap[T]>>
  >;
};

type FieldRenderers = {
  [K in keyof FieldTypeMap]: (props: RendererProps<K>) => ReactNode;
};

export const fieldRenderers: FieldRenderers = {
  text: ({ field }) => <Input {...field} nativeInput />,
  textArea: ({ field }) => <Textarea className="h-64" {...field} />,
  url: ({ field }) => <Input {...field} type="url" nativeInput />,
  image: ({ field }) => (
    <ImageDropzone
      maxFiles={1}
      value={Array.isArray(field.value) ? field.value.filter(Boolean) : []}
      onChange={(assets) => field.onChange(assets || [])}
    />
  ),

  richtext: ({ field }) => {
    return (
      <MinimalTiptapEditor
        value={field.value ?? ""}
        onChange={(val) => {
          if (val !== field.value) {
            field.onChange(val);
          }
        }}
        output="html"
        className="mx-0 w-full text-sm"
        editorContentClassName="p-2 min-h-56"
        placeholder="Enter content..."
      />
    );
  },
};
