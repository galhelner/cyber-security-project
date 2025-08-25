import dotenv from "dotenv";

// load .env file into process.env
dotenv.config();

// Simple helper for required env vars
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  ENV: requireEnv("ENV"),

  PORT: parseInt(process.env.PORT || "3000", 10),

  DB: {
    CONNECTION_INTERVAL: requireEnv("DB_CONNECTION_INTERVAL"),
    URL: requireEnv("DATABASE_URL")
  },

  JWT_SECRET: requireEnv("JWT_SECRET"),
};
