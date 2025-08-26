import { logger } from "./config/logger";
import { env } from "./config/env";
import express from 'express';
import firewallRoutes from "./routes/firewall.routes";
import { connectWithRetry, initDB } from "./config/db";


// server bootstrap function definition
async function bootstrap() {
  // connect to the DB
  await connectWithRetry();
  await initDB();

  // create express app
  const app = express();
  app.use(express.json());

  // mount routes under /api/firewall
  app.use("/api/firewall", firewallRoutes);

  const PORT = env.PORT || 3000;

  // running the express server
  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

// calling bootstrap function
bootstrap();