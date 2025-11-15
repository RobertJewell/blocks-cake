import { DefaultValues, Path, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { registry } from "~/lib/cms/blocks/block-registry";
import { Block, PropsOf } from "../blocks/block-registry.types";
import { fieldRenderers } from "./field-renderer";

type FormRendererProps<T extends Block["type"]> = {
  block: { id: string; type: T; props: PropsOf<T> };
  onChange?: (patch: Partial<PropsOf<T>>) => void;
};

export function FormRenderer<T extends Block["type"]>({
  block,
  onChange,
}: FormRendererProps<T>) {
  const fields = registry[block.type].fields;

  const form = useForm<PropsOf<T>>({
    defaultValues: block.props as DefaultValues<PropsOf<T>>,
  });

  form.watch((values) => {
    return onChange?.(values as Partial<PropsOf<T>>);
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        {Object.entries(fields).map(([key, def]) => {
          const Renderer = fieldRenderers[def.type as keyof typeof fieldRenderers];
          if (!Renderer) {
            return (
              <p key={key} className="text-sm text-red-600">
                Unknown field type: {def.type}
              </p>
            );
          }

          return (
            <FormField
              key={key}
              control={form.control}
              name={key as Path<PropsOf<T>>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{def.label}</FormLabel>
                  <FormControl>
                    {/*@ts-expect-error this will always match */}
                    {Renderer({ field: field })}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </form>
    </Form>
  );
}
