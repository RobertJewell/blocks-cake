import { createMiddleware } from "@tanstack/react-start";

export const exampleMiddlewareWithContext = createMiddleware({
  type: "function",
}).server(async (env) => {
  console.log("Executing exampleMiddlewareWithContext");
  return await env.next({
    context: {
      data: "Some Data From Middleware",
    },
  });
});
