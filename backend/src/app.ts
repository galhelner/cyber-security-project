import express, { Express } from 'express';
import firewallRoutes from './routes/firewall.routes.js';
import { Database } from './config/db.js';
import { Logger } from './config/logger.js';
import cors from "cors";
import { env } from './config/env.js';

const logger = Logger.getInstance();

export async function createApp(): Promise<Express> {
  // connect to the DB
  const database = Database.getInstance();
  await database.connectWithRetry();
  await database.initDB();

  // create and configure express app
  const app = express();
  app.use(express.json());

  app.use(cors({
    origin: env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }));

  // mount routes under /api/firewall
  app.use('/api/firewall', firewallRoutes);
  
  logger.info("Application created and configured successfully.");
  return app;
}