import { Database } from './src/config/db';
import { firewallRulesSchema } from './src/config/firewallRulesSchema';

module.exports = async () => {
    console.log('\nStarting global teardown...');
    const dbInstance = Database.getInstance();
    await dbInstance.getDrizzleDB().delete(firewallRulesSchema);
    await dbInstance.getPool().end();
    console.log('Global teardown complete: Database connection closed.');
};