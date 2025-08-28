import { createApp } from './app';
import { env } from './config/env';
import { Logger } from './config/logger';

const logger = Logger.getInstance();
const PORT = env.PORT || 5000;

async function startServer() {
    const app = await createApp();
    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT} in ${env.ENV} mode`);
    });
}

startServer();