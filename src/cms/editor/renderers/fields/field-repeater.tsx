import { isRepeaterDef } from "@/cms/blocks/block-registry.types";
import { Button } from "@/cms/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/cms/ui/card";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { fieldRenderers, RendererProps } from "./field-renderer";

export const RepeaterField = ({
  field,
  fieldDef,
  onChange,
}: RendererProps<"repeater">) => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
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
                remove(index);
                onChange?.();
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
                <div key={`${item.id}-${childKey}`} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {childDef.label}
                  </label>
                  <Controller
                    control={control}
                    name={childPath}
                    render={({ field: controllerField }) => (
                      <Renderer
                        fieldDef={childDef}
                        field={{
                          ...controllerField,
                          onChange: (val) => {
                            controllerField.onChange(val);
                            onChange?.();
                          },
                        }}
                      />
                    )}
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
              (acc, [k, d]) => ({ ...acc, [k]: d.defaultValue ?? "" }),
              {},
            );
            append(newItem);
            onChange?.();
          }}
        >
          <IconPlus className="mr-2 h-4 w-4" />
          Add {fieldDef.label}
        </Button>
      )}
    </div>
  );
};
