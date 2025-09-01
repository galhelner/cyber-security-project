import { RuleMode } from "../types/ruleMode.js";
import { RuleType } from "../types/ruleType.js";

/**
 * Interface represent the firewall rule model in DB
 */
export interface FirewallRule {
    id: number;
    value: string;
    type: RuleType;
    mode: RuleMode;
    active: boolean;
}