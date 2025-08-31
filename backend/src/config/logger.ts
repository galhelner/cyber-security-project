// src/utils/Logger.ts
import winston from "winston";
import { env } from "./env.js";

const { combine, timestamp, printf, colorize, json } = winston.format;

class Logger {
  private static instance: winston.Logger;

  private constructor() {} // private constructor prevents direct instantiation

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      // Define a custom development log format
      const devFormat = combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`)
      );

      // Define a custom production log format
      const prodFormat = combine(timestamp(), json());

      // Choose transport based on env
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

      // Create the singleton logger instance
      Logger.instance = winston.createLogger({
        level,
        format: env.ENV === "dev" ? devFormat : prodFormat,
        transports,
      });

      // Graceful fallback if file transport fails
      Logger.instance.on("error", (err) => {
        console.error("Logger failed, falling back to console:", err);
        Logger.instance.add(new winston.transports.Console());
      });

      // Optionally override console.* methods
      console.log = (...args) => Logger.instance.info(args.join(" "));
      console.error = (...args) => Logger.instance.error(args.join(" "));
      console.warn = (...args) => Logger.instance.warn(args.join(" "));
      console.debug = (...args) => Logger.instance.debug(args.join(" "));
    }

    return Logger.instance;
  }
}

export { Logger };