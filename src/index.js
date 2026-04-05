import express from 'express';
import { start as startScheduler } from './scheduler/index.js';
import config from './config/index.js';
import { createLogger } from './utils/logger.js';

const log = createLogger('Server');
const app = express();

// Static files
app.use(express.static('public'));

// Serve data files as /api/news.json and /api/content.json
app.use('/api', express.static('data'));

// Start server + scheduler
app.listen(config.server.port, () => {
  log.info(`Server running at http://localhost:${config.server.port}`);
  startScheduler();
  log.info('Astro-Info is running.');
});
