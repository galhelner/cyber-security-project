import { RuleMode } from "../types/ruleMode";
import { FirewallItem } from "./firewallItem";

/**
 * Interface represents the get rules response body
 */
export interface FirewallRulesResponse {
    ips: Record<RuleMode, FirewallItem[]>;
    urls: Record<RuleMode, FirewallItem[]>;
    ports: Record<RuleMode, FirewallItem[]>;
}