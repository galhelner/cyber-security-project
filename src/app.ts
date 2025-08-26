import { Logger } from "./config/logger";
import { env } from "./config/env";
import express from 'express';
import firewallRoutes from "./routes/firewall.routes";
import { Database } from "./config/db";

const logger = Logger.getInstance();

// server bootstrap function definition
async function bootstrap() {
  // connect to the DB
  const database = Database.getInstance();
  await database.connectWithRetry();
  await database.initDB();

  // create express app
  const app = express();
  app.use(express.json());

  // mount routes under /api/firewall
  app.use("/api/firewall", firewallRoutes);

  const PORT = env.PORT || 3000;

  // running the express server
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT} in ${env.ENV} mode`);
  });
}

// calling bootstrap function
bootstrap();