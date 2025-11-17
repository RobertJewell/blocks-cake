// DO NOT DELETE THIS FILE!!!
// This file is a good smoke test to make sure the custom server entry is working
import handler from "@tanstack/react-start/server-entry";
// import { getDB } from "./core/db/drizzle";
// import { env } from "cloudflare:workers";

console.log("[server-entry]: using custom server entry in 'src/server.ts'");

export default {
  fetch(request: Request) {
    // Commented out as I don't think this is the right way to handle this
    // const db = getDB(env.blocks_cake_db);
    return handler.fetch(request, {
      context: {
        fromFetch: true,
        // db,
      },
    });
  },
};
