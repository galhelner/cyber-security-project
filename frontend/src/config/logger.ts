import winston from "winston";
import { env } from "./env"

// Detect environment safely
const node_env = process.env.NODE_ENV || "development";

// Decide logging level based on environment
const logLevel = node_env === "production" ? "info" : "debug";

// Choose a debugging-friendly format
// Timestamp + colorize in dev + JSON-like for prod
const logFormat =
  node_env === "production"
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // machine-readable logs (good for log aggregators)
      )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
          }`;
        })
      );

// Create Winston logger instance
let logger: winston.Logger;

try {
  logger = winston.createLogger({
    level: logLevel,
    format: logFormat,
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
    ],
    exitOnError: false,
  });
} catch (err) {
  // Graceful fallback if winston init fails
  console.error("Logger initialization failed, falling back to console:", err);
  logger = winston.createLogger({
    transports: [new winston.transports.Console()],
  });
}

// Helper wrapper so we can re-use logger easily
export const Logger = {
  debug: (msg: string, meta?: object) => logger.debug(msg, meta),
  info: (msg: string, meta?: object) => logger.info(msg, meta),
  warn: (msg: string, meta?: object) => logger.warn(msg, meta),
  error: (msg: string, meta?: object) => logger.error(msg, meta),
};

// --- Override native console methods ---
console.log = (msg?: any, ...args: any[]) =>
  Logger.info(typeof msg === "string" ? msg : JSON.stringify(msg), args);

console.debug = (msg?: any, ...args: any[]) =>
  Logger.debug(typeof msg === "string" ? msg : JSON.stringify(msg), args);

console.warn = (msg?: any, ...args: any[]) =>
  Logger.warn(typeof msg === "string" ? msg : JSON.stringify(msg), args);

console.error = (msg?: any, ...args: any[]) =>
  Logger.error(typeof msg === "string" ? msg : JSON.stringify(msg), args);