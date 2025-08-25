import { Request, Response, NextFunction } from "express";
import { FirewallRulesRequest } from "../models/firewallRulesRequest";

/**
 * Middleware for update firewall rules request body validation
 */
export default function validateUpdateRules(
  req: Request<{}, {}, FirewallRulesRequest>,
  res: Response,
  next: NextFunction
) {
  const body = req.body;

  // At least one rule type must be present
  if (!body.ips && !body.urls && !body.ports) {
    return res.status(400).json({ error: "No rules provided to update" });
  }

  const types: ("ips" | "urls" | "ports")[] = ["ips", "urls", "ports"];

  for (const type of types) {
    const rules = body[type];
    if (!rules) continue;

    const { ids, mode, active } = rules;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: `${type}: ids must be a non-empty array` });
    }

    if (!["blacklist", "whitelist"].includes(mode)) {
      return res.status(400).json({ error: `${type}: invalid mode "${mode}"` });
    }

    if (typeof active !== "boolean") {
      return res.status(400).json({ error: `${type}: active must be boolean` });
    }
  }

  next();
}
