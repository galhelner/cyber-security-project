
let backendUrl: string | undefined = undefined;
if (typeof window === "undefined") {
  // Server-side: validate with Zod
  const { z } = require("zod");
  const frontendEnvSchema = z.object({
    NEXT_PUBLIC_BACKEND_URL: z
      .string()
      .refine((val: string) => {
        try {
          const url = new URL(val);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      }, { message: "DATABASE_URL must be a valid URL" })
  });
  const parsed = frontendEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("[env.ts] Environment variable validation failed:", parsed.error);
    throw parsed.error;
  }
  backendUrl = parsed.data.NEXT_PUBLIC_BACKEND_URL;
} else {
  // Client-side: use the inlined env variable
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
}

export const env = { NEXT_PUBLIC_BACKEND_URL: backendUrl };
