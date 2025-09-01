import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
 
export default defineConfig({
  schema: "./src/config/firewallRulesSchema.ts",
   out: `${__dirname}/drizzle`,
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});