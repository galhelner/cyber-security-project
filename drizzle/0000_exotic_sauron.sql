CREATE TABLE IF NOT EXISTS "firewall_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"rule_type" text NOT NULL,
	"rule_mode" text NOT NULL,
	"active" boolean DEFAULT true
);
