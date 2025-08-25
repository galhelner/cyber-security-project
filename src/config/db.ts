import { env } from "./env";
import { Pool } from 'pg';
import { logger } from "./logger";

// create postgres connection pool
const pool = new Pool({
  connectionString: env.DB.URL
});

// set retry interval
const retryInterval = Number(env.DB.CONNECTION_INTERVAL) || 5000;

// Stop and wait connection function
export async function connectWithRetry(): Promise<void> {
  try {
    // trying a simple query to check connection (some king of ping)
    await pool.query(`SELECT 1`);
    logger.info("✅ Database connected successfully");
  } catch (err) {
    logger.error("❌ Database connection failed. Retrying...", err);

    // wait and try again
    setTimeout(connectWithRetry, retryInterval);
  }
}

// DB initialization function
export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS firewall_rules (
        id SERIAL PRIMARY KEY,
        value TEXT NOT NULL,
        rule_type TEXT NOT NULL,
        rule_mode TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
  `);
}; 

// export the connection pool
export default pool;