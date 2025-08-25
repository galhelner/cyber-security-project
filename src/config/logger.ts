// src/utils/Logger.ts
import winston from "winston";
import { env } from "./env";

const { combine, timestamp, printf, colorize, json } = winston.format;

// Define a custom development log format
const devFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Define a custom production log format
const prodFormat = combine(
  timestamp(),
  json()
);

// Choose transport based on env (dev -> console, prod -> log file)
const transports =
  env.ENV === "dev"
    ? [new winston.transports.Console()]
    : [
        new winston.transports.File({
          filename: "logs/app.log",
          maxsize: 5 * 1024 * 1024, // 5MB
          maxFiles: 5,
        }),
      ];

// Set logger level based on env
const level = env.ENV === "dev" ? "debug" : "info";

// Create the logger
export const logger = winston.createLogger({
  level,
  format: env.ENV === "dev" ? devFormat : prodFormat,
  transports,
});

// Graceful fallback if file transport fails
logger.on("error", (err) => {
  console.error("Logger failed, falling back to console:", err);
  logger.add(new winston.transports.Console());
});

// Override console.log and others
console.log = (...args) => logger.info(args.join(" "));
console.error = (...args) => logger.error(args.join(" "));
console.warn = (...args) => logger.warn(args.join(" "));
console.debug = (...args) => logger.debug(args.join(" "));