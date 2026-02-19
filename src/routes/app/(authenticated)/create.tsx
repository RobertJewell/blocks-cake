import { Button } from "@/cms/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/cms/ui/form";
import { Input } from "@/cms/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/cms/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const Route = createFileRoute("/app/(authenticated)/create")({
  component: RouteComponent,
});

const createPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9_-]+$/,
      "Slug can only contain lowercase letters, numbers, hyphens, and underscores",
    ),
  status: z.enum(["draft", "published"]),
});

type CreatePageFormData = z.infer<typeof createPageSchema>;

type CreatePageResponse = {
  id: string;
  slug: string;
};

type ErrorResponse = {
  message: string;
};

function RouteComponent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreatePageFormData>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "draft",
    },
  });

  const onSubmit = async (data: CreatePageFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/pages/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        throw new Error(error.message || "Failed to create page");
      }

      const result = (await response.json()) as CreatePageResponse;
      toast.success(`Page "${data.title}" created successfully`);

      // Redirect to edit page
      await navigate({
        to: "/app/edit/$",
        params: { _splat: result.slug },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create page";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-8 font-editor">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Create New Page</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Start with a blank page and add blocks to build your content
          </p>
        </div>

        <div className="max-w-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Home, About Us, Pricing"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., home, about-us, pricing"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly identifier. Use lowercase letters, numbers,
                      hyphens, and underscores.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can change this later in the editor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Page"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate({ to: "/app" })}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
