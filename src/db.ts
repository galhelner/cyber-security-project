import { Pool } from 'pg';

// exports postgres connection pool
export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
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

