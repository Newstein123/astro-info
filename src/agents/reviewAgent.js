import * as ai from '../services/aiService.js';
import * as storage from '../services/storageService.js';
import { createLogger } from '../utils/logger.js';
import config from '../config/index.js';

const log = createLogger('ReviewAgent');

async function reviewEntries(type) {
  const entries = await storage.read(type);
  const unreviewed = entries.filter((e) => !e.reviewed);

  if (unreviewed.length === 0) {
    log.info(`No unreviewed ${type} entries`);
    return 0;
  }

  let reviewed = 0;
  const toReview = unreviewed.slice(0, config.limits.maxReviewsPerRun);

  for (const entry of toReview) {
    try {
      const result = await ai.reviewEntry(entry, type);

      if (result.improvements) {
        for (const [key, value] of Object.entries(result.improvements)) {
          if (value && value !== 'null' && entry[key] !== undefined) {
            entry[key] = value;
          }
        }
      }

      entry.reviewed = true;
      entry.reviewNotes = result.reviewNotes || null;
      reviewed++;
      log.info(`Reviewed: ${entry.id}`);
    } catch (err) {
      log.error(`Failed to review ${entry.id}: ${err.message}`);
    }
  }

  if (reviewed > 0) {
    await storage.update(type, entries);
  }

  return reviewed;
}

export async function run() {
  log.info('Starting review agent...');

  const newsReviewed = await reviewEntries('news');
  const contentReviewed = await reviewEntries('content');

  const result = { newsReviewed, contentReviewed };
  log.info(`Done. News reviewed: ${newsReviewed}, Content reviewed: ${contentReviewed}`);
  return result;
}

const isDirectRun = process.argv[1]?.includes('reviewAgent');
if (isDirectRun) {
  run().then((r) => console.log('Result:', r)).catch(console.error);
}
