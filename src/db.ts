import { Pool } from 'pg';

// exports postgres pool
export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});

// DB initialize function
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

