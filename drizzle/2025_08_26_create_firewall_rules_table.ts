import { sql } from "drizzle-orm";

export const up = sql`
  CREATE TABLE IF NOT EXISTS public.firewall_rules (
    id serial PRIMARY KEY NOT NULL,
    value text NOT NULL,
    rule_type text NOT NULL,
    rule_mode text NOT NULL,
    active boolean DEFAULT true
  );
`;

export const down = sql`
  DROP TABLE public.firewall_rules;
`;
