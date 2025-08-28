import { firewallRulesSchema } from "../config/firewallRulesSchema";
const { populateFirewallRules, pool, db } = require("../scripts/mock_data_population.js");

beforeAll(async () => {
  console.log("🚀 Load mock firewall rules into DB before tests");

  // Clear any existing data
  await db.delete(firewallRulesSchema);

  // Insert mock data
  await populateFirewallRules();
});

afterAll(async () => {
  console.log("🧹 Clear the DB after tests");

  // Clear mock data
  await db.delete(firewallRulesSchema);

  // Close DB connection
  await pool.end();
});