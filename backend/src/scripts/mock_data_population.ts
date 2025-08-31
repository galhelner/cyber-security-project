// scripts/mock_data_population.ts
import { faker } from '@faker-js/faker';
import { firewallRulesSchema } from '../config/firewallRulesSchema.js';
import { RuleType } from '../types/ruleType.js';
import { RuleMode } from '../types/ruleMode.js';
import { Database } from '../config/db.js';

const dbInstance = Database.getInstance();
const pool = dbInstance.getPool();
const db = dbInstance.getDrizzleDB();

// Edge-case and random values
const ipEdges = ['0.0.0.0', '255.255.255.255', '127.0.0.1'];
const urlEdges = [
  'http://localhost',
  'https://example.com',
  'https://this-is-a-very-long-url-for-testing-purposes.com/path/to/resource?query=123&another=true',
  ''
];
const portEdges = [0, 1, 65535];

// Helper to generate a value for a given type
function generateValue(type: RuleType, index: number): string {
  switch (type) {
    case RuleType.IP:
      return index < ipEdges.length
        ? ipEdges[index]
        : faker.internet.ip();
    case RuleType.URL:
      return index < urlEdges.length
        ? urlEdges[index]
        : faker.internet.url();
    case RuleType.PORT:
      return (index < portEdges.length
        ? portEdges[index]
        : faker.number.int({ min: 2, max: 65534 })
      ).toString();
  }
}

// Generate rules with full coverage
export async function populateFirewallRules() {
  await dbInstance.initDB();

  const types: RuleType[] = [RuleType.IP, RuleType.URL, RuleType.PORT];
  const modes: RuleMode[] = [RuleMode.BLACKLIST, RuleMode.WHITELIST];

  for (const type of types) {
    for (let i = 0; i < 10; i++) {
      // Rotate modes to cover both blacklist and whitelist
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

  console.log('Inserted 10 entries for each type with edge cases and full coverage.');
}

// export the pool to let the calling tests to clean up / end connection
export { pool };