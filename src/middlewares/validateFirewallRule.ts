import { Request, Response, NextFunction } from "express";
import { FirewallRequestBody } from "../models/firewallRequestBody";
import { RuleType } from "../types/ruleType";

/**
 * Midlleware for add/delete rule request body validation
 */
export function validateFirewallRule(type: RuleType) {
  return (req: Request<{}, {}, FirewallRequestBody>, res: Response, next: NextFunction) => {
    const { values, mode } = req.body;

    if (!mode || !Array.isArray(values) || values.length === 0) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Validate mode
    if (!["blacklist", "whitelist"].includes(mode)) {
      return res.status(400).json({ error: `Invalid mode: ${mode}` });
    }

    // Validate each value based on type
    for (const value of values) {
      switch (type) {
        case "ip":
          if (typeof value !== "string" || !isValidIP(value)) {
            return res.status(400).json({ error: `Invalid IP: ${value}` });
          }
          break;

        case "url":
          if (typeof value !== "string" || !isValidURL(value)) {
            return res.status(400).json({ error: `Invalid URL: ${value}` });
          }
          break;

        case "port":
          if (!isValidPort(value)) {
            return res.status(400).json({ error: `Invalid port: ${value}` });
          }
          break;

        default:
          return res.status(400).json({ error: `Invalid type: ${type}` });
      }
    }

    next();
  };
};

// ----- Helper functions -----
function isValidIP(ip: string): boolean {
  const ipRegex =
    /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;
  return ipRegex.test(ip);
}

function isValidURL(url: string): boolean {
  try {
    const u = new URL(url);
    return !!u.hostname;
  } catch {
    return false;
  }
}

function isValidPort(port: string | number): boolean {
  const num = Number(port);
  return Number.isInteger(num) && num > 0 && num <= 65535;
}
