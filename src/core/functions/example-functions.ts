import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { exampleMiddlewareWithContext } from "@/core/middleware/example-middleware";
import { drizzleMiddleware } from "../middleware/db-middleware";

const baseFunction = createServerFn().middleware([
  exampleMiddlewareWithContext,
  drizzleMiddleware,
]);

const ExampleInputSchema = z.object({
  exampleKey: z.string().min(1),
});

type ExampleInput = z.infer<typeof ExampleInputSchema>;

export const examplefunction = baseFunction
  .inputValidator((data: ExampleInput) => ExampleInputSchema.parse(data))
  .handler(async (ctx) => {
    console.log("Executing example function");
    console.log(`The data passed: ${JSON.stringify(ctx.data)}`);
    console.log(
      `The context from middleware: ${JSON.stringify(ctx.context.data)}`,
    );
    return "Function executed successfully";
  });
