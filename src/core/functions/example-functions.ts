import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { drizzleMiddleware } from "../middleware/db-middleware";

const baseFunction = createServerFn().middleware([drizzleMiddleware]);

const ExampleInputSchema = z.object({
  exampleKey: z.string().min(1),
});

type ExampleInput = z.infer<typeof ExampleInputSchema>;

export const examplefunction = baseFunction
  .inputValidator((data: ExampleInput) => ExampleInputSchema.parse(data))
  .handler(async (ctx) => {
    console.log("Executing example function");
    console.log(`The data passed: ${JSON.stringify(ctx.data)}`);
    return "Function executed successfully";
  });
