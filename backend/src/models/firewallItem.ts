/**
 * Interface represent a single firewall rule item of the rules response
 */
export interface FirewallItem {
    id: number;
    value: string;
    active: boolean;
}