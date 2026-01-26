import { registry } from "@/cms/blocks/block-registry";
import {
  Block,
  BlockConfigFields,
  PropsOf,
} from "@/cms/blocks/block-registry.types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useMemo } from "react";
import { DefaultValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { fieldRenderers } from "./field-renderer";

type FormRendererProps<T extends Block["type"]> = {
  block: Block;
  onSubmit?: SubmitHandler<PropsOf<T>>;
  onChange?: (patch: Partial<PropsOf<T>>) => void;
  children?: ReactNode;
};

export function FormRenderer<T extends Block["type"]>({
  block,
  onSubmit,
  onChange,
  children,
}: FormRendererProps<T>) {
  const blockDef = registry[block.type];

  const form = useForm<PropsOf<T>>({
    mode: "onChange",
    resolver: zodResolver(blockDef.schema as any),
    defaultValues: block.data as DefaultValues<PropsOf<T>>,
  });

  form.watch((values) => {
    return onChange?.(values as Partial<PropsOf<T>>);
  });

  const groups = useMemo(() => {
    const grouped: Record<string, { label: string; fields: string[] }> = {};

    Object.entries(blockDef.fields).forEach(([key, field]) => {
      const groupName = field.group || "Content";
      if (!grouped[groupName]) {
        grouped[groupName] = { label: groupName, fields: [] };
      }
      grouped[groupName].fields.push(key);
    });

    const tabOrder = blockDef.tabs || Object.keys(grouped);

    return tabOrder.map((tab) => grouped[tab]).filter(Boolean) as {
      label: string;
      fields: string[];
    }[];
  }, [blockDef]);

  const renderFields = (fieldKeys: string[]) => {
    return fieldKeys.map((key) => {
      const def = (blockDef.fields as BlockConfigFields)[key];
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
              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {def.label}
              </FormLabel>
              <FormControl>
                <Renderer field={field as any} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit && form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {groups.length > 1 ? (
          <Tabs defaultValue={groups[0].label} className="w-full">
            <TabsList
              className="grid w-full"
              style={{ gridTemplateColumns: `repeat(${groups.length}, 1fr)` }}
            >
              {groups.map((group) => (
                <TabsTrigger
                  key={group.label}
                  value={group.label}
                  className="text-xs"
                >
                  {group.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {groups.map((group) => (
              <TabsContent
                key={group.label + "content"}
                value={group.label}
                className="flex flex-col gap-4 pt-4"
              >
                {renderFields(group.fields)}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col gap-4">
            {renderFields(groups[0].fields)}
          </div>
        )}

        {children}
      </form>
    </Form>
  );
}
