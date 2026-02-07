import { AnyFieldDefinition } from "@/cms/blocks/block-registry.types";
import { Button } from "@/cms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/cms/ui/card";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { fieldRenderers, RendererProps } from "../field-renderer";

export const RepeaterField = ({
  field,
  fieldDef,
}: RendererProps<"repeater">) => {
  const { control, setValue, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  if (!("fields" in fieldDef)) return null;

  return (
    <div className="space-y-4">
      {fields.map((item: any, index) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-muted/30 p-2 px-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {fieldDef.label} {index + 1}
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => {
                remove(index);
                // Notify parent of the structural change
                field.onChange(getValues(field.name));
              }}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-3">
            {Object.entries(fieldDef.fields).map(([childKey, childValue]) => {
              const childDef = childValue as AnyFieldDefinition;
              const Renderer =
                fieldRenderers[childDef.type as keyof typeof fieldRenderers];

              if (!Renderer) return null;

              const childPath = `${field.name}.${index}.${childKey}`;

              return (
                <div key={childKey} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {childDef.label}
                  </label>
                  <Renderer
                    fieldDef={childDef as any}
                    field={{
                      name: childPath as any,
                      // 1. Important: Use getValues here to ensure we always have the freshest state
                      value:
                        getValues(childPath) ??
                        (childDef as any).defaultValue ??
                        "",
                      onChange: (val: any) => {
                        const extractedValue =
                          val?.target && "value" in val.target
                            ? val.target.value
                            : val;

                        // 2. Surgical Update: Update only this specific string in the form state.
                        // This prevents the whole array from being "replaced" and losing focus.
                        setValue(childPath, extractedValue, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });

                        // 3. Notify the Repeater's own Controller (for the Save button logic)
                        // We send the current state of the array.
                        field.onChange(getValues(field.name));
                      },
                      onBlur: () => {},
                      ref: () => {},
                    }}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      {(!fieldDef.max || fields.length < fieldDef.max) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          onClick={() => {
            const newItem = Object.entries(fieldDef.fields).reduce(
              (acc, [k, d]) => ({ ...acc, [k]: (d as any).defaultValue ?? "" }),
              {},
            );
            append(newItem);
            field.onChange([...getValues(field.name), newItem]);
          }}
        >
          <IconPlus className="mr-2 h-4 w-4" />
          Add {fieldDef.label}
        </Button>
      )}
    </div>
  );
};
