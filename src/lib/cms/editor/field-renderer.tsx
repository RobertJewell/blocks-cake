import { ControllerRenderProps, Path } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { MinimalTiptapEditor } from "~/components/ui/minimal-tiptap";
import { FieldTypeMap } from "../blocks/block-registry";

type RendererProps<T extends keyof FieldTypeMap> = {
  field: ControllerRenderProps<
    Record<string, FieldTypeMap[T]>,
    Path<Record<string, FieldTypeMap[T]>>
  >;
};

type FieldRenderers = {
  [K in keyof FieldTypeMap]: (props: RendererProps<K>) => React.ReactNode;
};

export const fieldRenderers: FieldRenderers = {
  text: ({ field }) => <Input {...field} />,

  image: ({ field }) => (
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => field.onChange(e.target.files?.[0]?.name ?? "")}
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
        editorContentClassName="p-2"
        placeholder="Enter content..."
      />
    );
  },
};
