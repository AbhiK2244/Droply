import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL is not set in environment");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "public",
  },
  verbose: true,
  strict: true,
});

// important information about the config file:

/* The drizzle.config.ts file is used by Drizzle during development to manage database setup.
 It tells Drizzle where the schema file is, where to store migration files, which database to
 connect to, and other settings. It’s mainly needed when creating or updating tables and running
 migrations, not when the app runs in production. However, it should still be kept in the project
 for future database changes or CI/CD migration setups. */
