import { isRepeaterDef } from "@/cms/blocks/block-registry.types";
import { Button } from "@/cms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/cms/ui/card";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { fieldRenderers, RendererProps } from "./field-renderer";

export const RepeaterField = ({
  field,
  fieldDef,
}: RendererProps<"repeater">) => {
  const { control, setValue, getValues } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: field.name,
  });

  if (!isRepeaterDef(fieldDef)) return null;

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
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
                const currentValues = getValues(field.name) || [];
                const newArray = currentValues.filter(
                  (_: any, i: number) => i !== index,
                );
                setValue(field.name, newArray, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            >
              <IconX className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-3">
            {Object.entries(fieldDef.fields).map(([childKey, childDef]) => {
              const Renderer = fieldRenderers[childDef.type];

              if (!Renderer) return null;

              const childPath = `${field.name}.${index}.${childKey}`;

              return (
                <div key={childKey} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {childDef.label}
                  </label>
                  <Renderer
                    fieldDef={childDef}
                    field={{
                      name: childPath,
                      value:
                        getValues(childPath) ?? childDef.defaultValue ?? "",
                      onChange: (val) => {
                        const extractedValue =
                          val?.target && "value" in val.target
                            ? val.target.value
                            : val;

                        setValue(childPath, extractedValue, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
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
            const currentValues = getValues(field.name) || [];
            const newItem = Object.entries(fieldDef.fields).reduce(
              (acc, [k, d]) => ({ ...acc, [k]: d.defaultValue ?? "" }),
              {},
            );
            const newArray = [...currentValues, newItem];
            setValue(field.name, newArray, {
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
        >
          <IconPlus className="mr-2 h-4 w-4" />
          Add {fieldDef.label}
        </Button>
      )}
    </div>
  );
};
