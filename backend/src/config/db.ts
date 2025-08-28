import { env } from "./env";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Logger } from "./logger";

const logger = Logger.getInstance();

class Database {
  private static instance: Database;
  private pool: Pool;
  private drizzleDB: ReturnType<typeof drizzle>;
  private retryInterval: number;

  private constructor() {
    this.pool = new Pool({ connectionString: env.DATABASE_URL });
    this.drizzleDB = drizzle(this.pool);
    this.retryInterval = Number(env.DB_CONNECTION_INTERVAL) || 5000;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public getDrizzleDB() {
    return this.drizzleDB;
  }

  public async connectWithRetry(): Promise<void> {
    try {
      await this.pool.query("SELECT 1");
      logger.info(`✅ Database connected successfully in ${env.ENV} mode`);
    } catch (err) {
      logger.error("❌ Database connection failed. Retrying...", err);
      setTimeout(() => this.connectWithRetry(), this.retryInterval);
    }
  }

  public async initDB(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS firewall_rules (
        id SERIAL PRIMARY KEY,
        value TEXT NOT NULL,
        rule_type TEXT NOT NULL,
        rule_mode TEXT NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
    `);
  }
}

// export drizzle instance for queries
const database = Database.getInstance();
export const db = database.getDrizzleDB();
export { Database };
