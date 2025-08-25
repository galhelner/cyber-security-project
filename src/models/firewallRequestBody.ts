import { RuleMode } from "../types/ruleMode";
import { RuleType } from "../types/ruleType";

/**
 * Interface represent the add/delete rule request body
 */
export interface FirewallRequestBody {
    values: (string | number)[];
    mode: RuleMode;
}