import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your .env.local — see .env.example.",
  );
}

const globalForDb = globalThis as unknown as {
  __sqr_pg__?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__sqr_pg__ ??
  postgres(connectionString, {
    prepare: false,
    max: 10,
    idle_timeout: 20,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__sqr_pg__ = client;
}

export const db = drizzle(client, { schema });
export type DB = typeof db;
export { schema };
