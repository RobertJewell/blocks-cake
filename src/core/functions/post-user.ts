import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { drizzleMiddleware } from "../middleware/db-middleware";
import { users } from "../db/schema";

const baseFunction = createServerFn().middleware([drizzleMiddleware]);

const ExampleInputSchema = z.object({
  name: z.string().min(1), // we'll use this as the name
});

type ExampleInput = z.infer<typeof ExampleInputSchema>;

export const postUser = baseFunction
  .inputValidator((data: ExampleInput) => ExampleInputSchema.parse(data))
  .handler(async (ctx) => {
    const db = ctx.context.db;
    const name = ctx.data.name;
    const result = await db.insert(users).values({ name }).returning();
    console.log("Inserted user:", result);
    return { success: true, user: result[0] };
  });
