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
  PORT: parseInt(process.env.PORT || "3000", 10),

  DB: {
    HOST: requireEnv("PGHOST"),
    PORT: parseInt(process.env.PGPORT || "5432", 10),
    USER: requireEnv("PGUSER"),
    PASSWORD: requireEnv("PGPASSWORD"),
    NAME: requireEnv("PGDATABASE"),
  },

  JWT_SECRET: requireEnv("JWT_SECRET"),
};
