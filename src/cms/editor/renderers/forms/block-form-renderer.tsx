import { registry } from "@/cms/blocks/block-registry";
import { Block, PropsOf } from "@/cms/blocks/block-registry.types";
import { Form } from "@/cms/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/cms/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { renderFormFields, useFieldGroups } from "./utils";

type BlockFormRendererProps<T extends Block["type"]> = {
  block: Block;
  onSubmit?: SubmitHandler<PropsOf<T>>;
  onChange?: (patch: Partial<PropsOf<T>>) => void;
  children?: ReactNode;
};

export function BlockFormRenderer<T extends Block["type"]>({
  block,
  onSubmit,
  onChange,
  children,
}: BlockFormRendererProps<T>) {
  const blockDef = registry[block.type];

  const form = useForm<PropsOf<T>>({
    mode: "onChange",
    resolver: zodResolver(blockDef.schema as any),
    defaultValues: block.data as DefaultValues<PropsOf<T>>,
  });

  const groups = useFieldGroups(blockDef.fields);

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
                {renderFormFields({
                  fieldKeys: group.fields,
                  fields: blockDef.fields,
                  form,
                  onChange,
                })}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col gap-4">
            {renderFormFields({
              fieldKeys: groups[0].fields,
              fields: blockDef.fields,
              form,
              onChange,
            })}
          </div>
        )}

        {children}
      </form>
    </Form>
  );
}
