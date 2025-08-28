import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/config/schema.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: process.env.DB_URL,
});
