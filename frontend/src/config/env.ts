import { z } from "zod";
import { Logger } from "@/config/logger";

const frontendEnvSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z
    .string()
    .refine((val) => {
    try {
      const url = new URL(val);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, { message: "DATABASE_URL must be a valid URL"})
});

const parsed = frontendEnvSchema.safeParse(process.env);
if (!parsed.success) {
  // Log the error and throw to ensure the app fails fast
  Logger.error("[env.ts] Environment variable validation failed:", parsed.error);
  throw parsed.error;
}
export const env = parsed.data;
