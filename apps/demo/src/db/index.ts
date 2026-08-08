import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and set it (see README for local Docker or Neon setup)."
  );
}

// Reuse a single connection across hot reloads in dev so we don't exhaust
// Postgres connections every time a file changes.
const globalForDb = globalThis as unknown as {
  pgClient?: postgres.Sql;
};

const client =
  globalForDb.pgClient ??
  postgres(process.env.DATABASE_URL, {
    // Neon (and most managed Postgres) requires SSL; local Docker Postgres doesn't.
    ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1")
      ? false
      : "require",
    max: process.env.NODE_ENV === "production" ? 10 : 1,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgClient = client;
}

export const db = drizzle(client, { schema });
