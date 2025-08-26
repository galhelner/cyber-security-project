import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env"
 
export default defineConfig({
  schema: "./src/config/firewallRulesSchema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DB.URL!,
  },
});