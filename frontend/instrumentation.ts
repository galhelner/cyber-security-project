// instrumentation.ts
import { Logger } from "./src/config/logger";

export async function register() {
  try {
    Logger.info("🔧 Instrumentation started: Logger initialized");
  } catch (err) {
    console.error("Failed to initialize instrumentation", err);
  }
}