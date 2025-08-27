import { populateFirewallRules } from "./src/scripts/mock_data_population";

module.exports = async () => {
    console.log('\nStarting global setup...');
    await populateFirewallRules();
};