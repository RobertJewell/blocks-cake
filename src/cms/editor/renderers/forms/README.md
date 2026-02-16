# Form Renderers

This directory contains form rendering components that dynamically generate forms based on field configurations.

## Components

### FormRenderer (Generic)

A generic form renderer that can work with any field configuration. It doesn't require the config to be registered in the block registry.
This is useful for the generic forms you would expect, but also useful when you have blocks with extra requirements we don't want to include in the block renderer / registry.
TODO - update this use the renderprops pattern so we can pass the form to the children, there's no need for this yet, but it seems likely we'll need it.

**Features:**

- Works with any field configuration
- Auto-generates Zod schema from fields if not provided
- Supports custom schemas
- Supports field grouping with tabs
- Provides onChange and onSubmit callbacks

**Usage:**

```tsx
import { FormRenderer } from "@/cms/editor/renderers";
import { navigationFloatingSimpleConfig } from "@/cms/blocks/navigation/navigation-floating-simple/navigation-floating-simple-config";

<FormRenderer
  fields={navigationFloatingSimpleConfig}
  defaultValues={{
    logo: [],
    ctaText: "Get Started",
    menuItems: [],
  }}
  onSubmit={(data) => console.log(data)}
  onChange={(patch) => console.log(patch)}
>
  <Button type="submit">Save</Button>
</FormRenderer>;
```

**With custom schema:**

```tsx
import { z } from "zod";

<FormRenderer
  fields={myFields}
  schema={z.object({
    name: z.string().min(1),
    email: z.string().email(),
  })}
  defaultValues={{ name: "", email: "" }}
  onSubmit={(data) => console.log(data)}
/>;
```

### BlockFormRenderer (Block-specific)

A specialized form renderer for blocks that are registered in the block registry.
Honestly, this is mostly to get better type hints in the registry, and later to enforce the shape of the blocks when we allow the user to addd their own blocks.

**Usage:**

```tsx
import { BlockFormRenderer } from "@/cms/editor/renderers";

<BlockFormRenderer
  block={block}
  onChange={(patch) => updateBlock(patch)}
  onSubmit={(data) => console.log(data)}
>
  <Button type="submit">Save Block</Button>
</BlockFormRenderer>;
```
