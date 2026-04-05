import cron from 'node-cron';
import { run as runNews } from '../agents/newsAgent.js';
import { run as runContent } from '../agents/contentAgent.js';
import { run as runReview } from '../agents/reviewAgent.js';
import config from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Scheduler');

export function start() {
  log.info('Scheduling agents...');

  cron.schedule(config.schedule.news, async () => {
    log.info('Running News Agent...');
    try {
      await runNews();
    } catch (err) {
      log.error(`News Agent failed: ${err.message}`);
    }
  });

  cron.schedule(config.schedule.content, async () => {
    log.info('Running Content Agent...');
    try {
      await runContent();
    } catch (err) {
      log.error(`Content Agent failed: ${err.message}`);
    }
  });

  cron.schedule(config.schedule.review, async () => {
    log.info('Running Review Agent...');
    try {
      await runReview();
    } catch (err) {
      log.error(`Review Agent failed: ${err.message}`);
    }
  });

  log.info(`News Agent: ${config.schedule.news}`);
  log.info(`Content Agent: ${config.schedule.content}`);
  log.info(`Review Agent: ${config.schedule.review}`);
  log.info('All agents scheduled.');
}
