import { RuleMode } from "../types/ruleMode";
import { RuleType } from "../types/ruleType";

export interface FirewallRequestBody {
    values: (string | number)[];
    mode: RuleMode;
}