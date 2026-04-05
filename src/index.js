import express from 'express';
import { join } from 'path';
import { start as startScheduler } from './scheduler/index.js';
import * as storage from './services/storageService.js';
import config from './config/index.js';
import { createLogger } from './utils/logger.js';

const log = createLogger('Server');
const app = express();

// Static files
app.use(express.static('public'));

// API routes
app.get('/api/news', async (req, res) => {
  const data = await storage.read('news');
  res.json(data.reverse());
});

app.get('/api/content', async (req, res) => {
  const data = await storage.read('content');
  res.json(data.reverse());
});

app.get('/api/stats', async (req, res) => {
  const news = await storage.read('news');
  const content = await storage.read('content');
  res.json({
    newsCount: news.length,
    contentCount: content.length,
    lastNewsDate: news.at(-1)?.createdAt || null,
    lastContentDate: content.at(-1)?.createdAt || null,
  });
});

// Start server + scheduler
app.listen(config.server.port, () => {
  log.info(`Server running at http://localhost:${config.server.port}`);
  startScheduler();
  log.info('Astro-Info is running.');
});
