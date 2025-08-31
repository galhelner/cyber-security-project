import { createApp } from './app.js';
import { env } from './config/env.js';
import { Logger } from './config/logger.js';

const logger = Logger.getInstance();
const PORT = env.PORT || 5000;

async function startServer() {
    const app = await createApp();
    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT} in ${env.ENV} mode`);
    });
}

startServer();