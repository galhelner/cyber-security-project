const { faker } = require("@faker-js/faker");
const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const { firewallRulesSchema } = require("../config/firewallRulesSchema");
const { RuleType } = require("../types/ruleType");
const { RuleMode } = require("../types/ruleMode");
const { env } = require("../config/env");

// PostgreSQL connection pool
const pool = new Pool({ connectionString: env.DATABASE_URL });
const db = drizzle(pool);

// Edge-case values
const ipEdges = ["0.0.0.0", "255.255.255.255", "127.0.0.1"];
const urlEdges = ["http://localhost", "https://example.com", "https://long-url.test", ""];
const portEdges = [0, 1, 65535];

function generateValue(type, index) {
  switch (type) {
    case RuleType.IP:
      return index < ipEdges.length ? ipEdges[index] : faker.internet.ip();
    case RuleType.URL:
      return index < urlEdges.length ? urlEdges[index] : faker.internet.url();
    case RuleType.PORT:
      return index < portEdges.length ? portEdges[index] : faker.datatype.number({ min: 2, max: 65534 }).toString();
  }
}

async function populateFirewallRules() {
  const types = [RuleType.IP, RuleType.URL, RuleType.PORT];
  const modes = [RuleMode.BLACKLIST, RuleMode.WHITELIST];

  for (const type of types) {
    for (let i = 0; i < 10; i++) {
      const mode = modes[i % modes.length];
      const value = generateValue(type, i);

      await db.insert(firewallRulesSchema).values({
        value,
        ruleType: type,
        ruleMode: mode,
        active: faker.datatype.boolean(),
      });
    }
  }

  console.log("Inserted 10 entries per type with edge cases.");
}

module.exports = { populateFirewallRules, pool, db };