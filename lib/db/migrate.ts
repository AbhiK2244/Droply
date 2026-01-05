import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL is not set in environment");
}

async function runMigrations() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully");
  } catch (error) {
    console.error("Error applying migrations:", error);
    process.exit(1);
  }
}

runMigrations();

// This script connects to the PostgreSQL database using the connection string
// from the .env.local file and applies any pending migrations found in the
// ./drizzle directory. It uses Drizzle ORM's migration tools to ensure the
// database schema is up to date with the defined migrations.
