import { env } from "./env";
import { Pool } from 'pg';

// exports postgres connection pool
export const pool = new Pool({
  host: env.DB.HOST,
  user: env.DB.USER,
  password: env.DB.PASSWORD,
  database: env.DB.NAME,
  port: Number(env.DB.PORT),
});

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

