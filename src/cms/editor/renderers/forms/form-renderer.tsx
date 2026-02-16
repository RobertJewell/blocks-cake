import { createSchema } from "@/cms/blocks/block-builder";
import { BlockConfigFields } from "@/cms/blocks/block-registry.types";
import { Form } from "@/cms/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/cms/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { DefaultValues, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { renderFormFields, useFieldGroups } from "./utils";

type FormRendererProps<T extends Record<string, any>> = {
  fields: BlockConfigFields;
  schema?: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit?: SubmitHandler<T>;
  onChange?: (patch: Partial<T>) => void;
  children?: ReactNode;
};

export function FormRenderer<T extends Record<string, any>>({
  fields,
  schema,
  defaultValues,
  onSubmit,
  onChange,
  children,
}: FormRendererProps<T>) {
  // Auto-generate schema if not provided
  const resolvedSchema = schema ?? (createSchema(fields) as z.ZodType<T>);

  const form = useForm<T>({
    mode: "onChange",
    resolver: zodResolver(resolvedSchema as any),
    defaultValues: defaultValues ?? ({} as DefaultValues<T>),
  });

  const groups = useFieldGroups(fields);

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
                  fields,
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
              fields,
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
