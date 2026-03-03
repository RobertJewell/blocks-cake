import { getDB } from "../db/drizzle";
import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { CMSContext } from "../context";

export function createAuthInstance(context: CMSContext) {
  const db = getDB(context.database);

  return betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite" }),
    baseURL: context.auth.baseURL,
    secret: context.auth.secret,
    emailAndPassword: { enabled: true },
    plugins: [tanstackStartCookies()],
    socialProviders: {
      google: {
        clientId: context.auth.googleClientId,
        clientSecret: context.auth.googleClientSecret,
      },
    },
  });
}
