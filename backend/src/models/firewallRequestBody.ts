import { RuleMode } from "../types/ruleMode.js";
import { RuleType } from "../types/ruleType.js";

/**
 * Interface represent the add/delete rule request body
 */
export interface FirewallRequestBody {
    values: (string | number)[];
    mode: RuleMode;
}