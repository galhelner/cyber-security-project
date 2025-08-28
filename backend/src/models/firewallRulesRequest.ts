import { RuleMode } from "../types/ruleMode";

/**
 * Interface represents the update rules request body
 */
export interface FirewallRulesRequest {
    ips?: {
        ids: number[];
        mode: RuleMode;
        active: boolean;
    };
    urls?: {
        ids: number[];
        mode: RuleMode;
        active: boolean;
    };
    ports?: {
        ids: number[];
        mode: RuleMode;
        active: boolean;
    };
}
