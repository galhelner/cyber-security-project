import { pgTable, serial, text, boolean } from "drizzle-orm/pg-core";

export const firewallRulesSchema = pgTable("firewall_rules", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),
  ruleType: text("rule_type").notNull(),
  ruleMode: text("rule_mode").notNull(),
  active: boolean("active").notNull().default(true),
});
