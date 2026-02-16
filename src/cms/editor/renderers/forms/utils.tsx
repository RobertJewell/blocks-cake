import { BlockConfigFields } from "@/cms/blocks/block-registry.types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/cms/ui/form";
import { useMemo } from "react";
import { Path, UseFormReturn } from "react-hook-form";
import { fieldRenderers } from "../fields/field-renderer";

export type FieldGroup = {
  label: string;
  fields: string[];
};

/**
 * Groups fields by their group property
 */
export function useFieldGroups(fields: BlockConfigFields): FieldGroup[] {
  return useMemo(() => {
    const grouped: Record<string, { label: string; fields: string[] }> = {};

    Object.entries(fields).forEach(([key, field]) => {
      const groupName = field.group || "Content";
      if (!grouped[groupName]) {
        grouped[groupName] = { label: groupName, fields: [] };
      }
      grouped[groupName].fields.push(key);
    });

    const tabOrder = Object.keys(grouped);

    return tabOrder.map((tab) => grouped[tab]).filter(Boolean) as FieldGroup[];
  }, [fields]);
}

type RenderFieldsConfig<T extends Record<string, any>> = {
  fieldKeys: string[];
  fields: BlockConfigFields;
  form: UseFormReturn<T>;
  onChange?: (patch: Partial<T>) => void;
};

/**
 * Renders a list of form fields
 */
export function renderFormFields<T extends Record<string, any>>({
  fieldKeys,
  fields,
  form,
  onChange,
}: RenderFieldsConfig<T>) {
  return fieldKeys.map((key) => {
    const fieldDef = fields[key];
    const Renderer =
      fieldRenderers[fieldDef.type as keyof typeof fieldRenderers];

    if (!Renderer) {
      return (
        <p key={key} className="text-sm text-red-600">
          Unknown field type: {fieldDef.type}
        </p>
      );
    }

    return (
      <FormField
        key={key}
        control={form.control}
        name={key as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs text-muted-foreground">
              {fieldDef.label}
            </FormLabel>
            <FormControl>
              <Renderer
                fieldDef={fieldDef}
                field={{
                  ...field,
                  onChange: (val) => {
                    // Extract the value
                    const extractedValue =
                      val?.target && "value" in val.target
                        ? val.target.value
                        : val;

                    field.onChange(extractedValue);

                    if (onChange) {
                      const currentValues = form.getValues();
                      onChange({
                        ...currentValues,
                        [key]: extractedValue,
                      });
                    }
                  },
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  });
}
