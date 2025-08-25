import { RuleMode } from "../types/ruleMode";
import { RuleType } from "../types/ruleType";

export interface FirewallRule {
    id: number;
    value: string; // all rules value will be saved as string
    type: RuleType;
    mode: RuleMode;
    active: boolean;
}