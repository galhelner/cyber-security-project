import { RuleMode } from "../types/ruleMode";

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
