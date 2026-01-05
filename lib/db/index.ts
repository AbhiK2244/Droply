import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

console.log("Database URL:", process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL!); //The ! is used to tell TypeScript “I’m sure this variable exists,” so it stops complaining about possible undefined values.
export const db = drizzle(sql, { schema });
export { sql };
