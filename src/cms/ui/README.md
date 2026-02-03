# CMS UI Components

This directory contains UI components specifically for the CMS functionality, based on the @coss/ui component library. These components are separate from the main site components to maintain clear boundaries between CMS and public-facing functionality.

## Component Structure

- **@coss/ui components**: Modern, accessible components from the COSS design system
- **Legacy shadcn components**: Some components (form, dropdown-menu) copied from the original shadcn/ui for compatibility
- **MinimalTiptap**: Rich text editor moved from main components
- **File uploads**: Image dropzone and related components moved from main components

## Usage

### Import CMS Components

```tsx
// CMS-specific components (new @coss/ui components)
import { Button } from "@/cms/ui/button";
import { Card } from "@/cms/ui/card";
import { Dialog } from "@/cms/ui/dialog";
import { Input } from "@/cms/ui/input";

// Rich text editor (moved to CMS)
import { MinimalTiptapEditor } from "@/cms/ui/minimal-tiptap";

// File uploads (moved to CMS)
import { ImageDropzone } from "@/cms/ui/file-uploads/image-dropzone";

// Form components (hybrid: shadcn form + @coss/ui inputs)
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/cms/ui/form";
```

### Example CMS Form

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/cms/ui/button";
import { Card } from "@/cms/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/cms/ui/form";
import { Input } from "@/cms/ui/input";
import { MinimalTiptapEditor } from "@/cms/ui/minimal-tiptap";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export function CMSContentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title..." {...field} nativeInput />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <MinimalTiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter content..."
                    className="min-h-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save Content</Button>
        </form>
      </Form>
    </Card>
  );
}
```

## Component Categories

### @coss/ui Components (New)

- `accordion` - Collapsible content sections
- `alert` - Status messages and notifications
- `avatar` - User profile images
- `badge` - Status indicators and labels
- `button` - Primary action elements
- `card` - Content containers
- `checkbox` - Boolean input controls
- `combobox` - Searchable select inputs
- `dialog` - Modal dialogs
- `input` - Text input fields
- `label` - Form field labels
- `popover` - Floating content panels
- `progress` - Progress indicators
- `radio-group` - Single-choice selection
- `select` - Dropdown selection
- `separator` - Visual content dividers
- `skeleton` - Loading placeholders
- `slider` - Range input controls
- `spinner` - Loading indicators
- `switch` - Toggle controls
- `table` - Data tables
- `tabs` - Tabbed content
- `textarea` - Multi-line text input
- `toast` - Temporary notifications
- `tooltip` - Contextual help text

### Hybrid Components (Best of Both Worlds)

- `form` - Shadcn form components for proven React Hook Form integration
- `dropdown-menu` - Context menus (for MinimalTiptap compatibility)

### CMS-Specific Components

- `minimal-tiptap/` - Rich text editor with formatting tools
- `file-uploads/` - Image and file upload components

## Utilities

The CMS components use centralized utility functions:

```tsx
import { cn } from "@/cms/lib/utils";

// Combine class names with proper precedence
const className = cn("base-styles", conditionalClass && "conditional-styles");
```

## Form System

The CMS uses a hybrid form system that combines the best of both worlds:

- **Form Components**: Proven shadcn form components with React Hook Form integration
  - `Form`: FormProvider wrapper with form context
  - `FormField`: Controller with integrated validation and context
  - `FormItem`: Layout container with proper spacing
  - `FormLabel`: Context-aware labels with error states
  - `FormControl`: Input wrapper with accessibility features
  - `FormMessage`: Context-aware error message display

- **Input Components**: Modern @coss/ui inputs with `nativeInput` prop for compatibility
  - Uses native HTML inputs for React Hook Form compatibility
  - Maintains @coss/ui design system styling
  - Supports all standard HTML input attributes

## Comparison with Site Components

| Aspect           | CMS Components (`@/cms/ui/*`)  | Site Components (`@/components/ui/*`) |
| ---------------- | ------------------------------ | ------------------------------------- |
| Library          | @coss/ui inputs + shadcn forms | shadcn/ui (traditional, Radix UI)     |
| Purpose          | CMS/admin interface            | Public-facing website                 |
| Styling          | COSS design system             | Custom design system                  |
| Forms            | Hybrid: shadcn form + @coss/ui | FormField-based with Radix UI         |
| Rich Text        | MinimalTiptap included         | Not included                          |
| File Uploads     | ImageDropzone included         | Not included                          |
| Form Integration | FormField render props         | FormField render props                |

This separation ensures that CMS functionality remains isolated and can evolve independently from the public site components.

## React Hook Form Compatibility

The CMS form system uses a hybrid approach for optimal compatibility:

### Form Structure

- **Form Components**: Use proven shadcn form components (`Form`, `FormField`, `FormItem`, etc.)
- **Input Components**: Use @coss/ui inputs with `nativeInput` prop for compatibility

### Best Practices

```tsx
import { Input } from "@/cms/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/cms/ui/form";

// ✅ Recommended: Use nativeInput with shadcn form structure
<FormField
  control={control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} nativeInput />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// ❌ Avoid: Base UI InputPrimitive may have compatibility issues
<FormField
  control={control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

The `nativeInput` prop tells the Input component to render a native HTML `<input>` element instead of the Base UI InputPrimitive, ensuring full compatibility with React Hook Form while maintaining @coss/ui styling and the proven shadcn form structure for error handling and validation.
