import { populateFirewallRules } from "./src/scripts/mock_data_population";

beforeAll(async () => {
    // load mock data to test DB
    await populateFirewallRules();
});