import { env } from "./config/env";
import express from 'express';
import firewallRoutes from "./routes/firewall.routes";
import { initDB } from "./config/db";


// server bootstrap function definition
async function bootstrap() {
  try {
    // create the DB tables
    await initDB();
    console.log('Database initialized');
  } catch (err) {
    console.log('Failed to initialize database', err);
    process.exit(1);
  }

  // create express app
  const app = express();
  app.use(express.json());

  // mount routes under /api/firewall
  app.use("/api/firewall", firewallRoutes);

  const PORT = env.PORT || 3000;

  // running the express server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// calling bootstrap function
bootstrap();