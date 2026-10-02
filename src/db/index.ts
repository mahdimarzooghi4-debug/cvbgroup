import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type Database = PostgresJsDatabase<typeof schema>;
const globalForDb = globalThis as typeof globalThis & {
  cvbSql?: ReturnType<typeof postgres>;
  cvbDb?: Database;
};

export function getDb(): Database | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!globalForDb.cvbSql) {
    globalForDb.cvbSql = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      ssl: connectionString.includes("localhost") ? false : "require",
    });
    globalForDb.cvbDb = drizzle(globalForDb.cvbSql, { schema });
  }
  return globalForDb.cvbDb ?? null;
}
