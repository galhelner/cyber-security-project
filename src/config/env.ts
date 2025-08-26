import { z } from "zod";
import dotenv from "dotenv";

// load .env file into process.env in dev mode
if (process.env.ENV !== "prod") {
  dotenv.config();
}

const envSchema = z.object({
  ENV: z.enum(["dev", "prod"]),
  PORT: z.coerce.number()
  .int()
  .min(1, "Port must be at least 1")
  .max(65535, "Port cannot be greater than 65535")
  .default(3000),
  DB_CONNECTION_INTERVAL: z.number().default(5000),
  DATABASE_URL: z.string().refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, { message: "DATABASE_URL must be a valid URL"}),
  JWT_SECRET: z.string().min(10),
});

export const env = envSchema.parse(process.env);
