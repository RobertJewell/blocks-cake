import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDB } from "@/core/db/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { env } from "cloudflare:workers";

export function createAuthInstance() {
  const db = getDB(env.blocks_cake_db);

  return betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite" }),
    emailAndPassword: { enabled: true },
    plugins: [reactStartCookies()],
  });
}

export type AuthInstance = ReturnType<typeof createAuthInstance>;

export type AuthSession = Awaited<
  ReturnType<AuthInstance["api"]["getSession"]>
>;
