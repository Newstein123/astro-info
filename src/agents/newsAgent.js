import { fetchFeeds } from '../services/rssService.js';
import * as ai from '../services/aiService.js';
import * as image from '../services/imageService.js';
import * as storage from '../services/storageService.js';
import { generateId } from '../utils/idGenerator.js';
import { createLogger } from '../utils/logger.js';
import config from '../config/index.js';

const log = createLogger('NewsAgent');

export async function run() {
  log.info('Starting news agent...');
  const result = { added: 0, skipped: 0, errors: [] };

  try {
    const rawArticles = await fetchFeeds();
    log.info(`Fetched ${rawArticles.length} total articles from RSS`);

    let processed = 0;

    for (const raw of rawArticles) {
      if (processed >= config.limits.maxNewsPerRun) break;
      if (!raw.link) continue;

      const isDuplicate = await storage.exists('news', 'link', raw.link);
      if (isDuplicate) {
        result.skipped++;
        continue;
      }

      try {
        const aiResult = await ai.processNewsArticle(raw);
        const id = generateId('news', raw.link);
        const imagePath = await image.generate(id, raw.title);

        const entry = {
          id,
          source: raw.source,
          sourceUrl: raw.sourceUrl,
          originalTitle: raw.title,
          title: aiResult.title,
          summary: aiResult.summary,
          tags: aiResult.tags || [],
          category: aiResult.category || 'space',
          link: raw.link,
          image: imagePath,
          publishedAt: raw.pubDate ? new Date(raw.pubDate).toISOString() : null,
          createdAt: new Date().toISOString(),
          reviewed: false,
        };

        await storage.append('news', [entry]);
        result.added++;
        processed++;
        log.info(`Added: ${entry.title}`);
      } catch (err) {
        result.errors.push(`${raw.title}: ${err.message}`);
        log.error(`Failed to process: ${raw.title} - ${err.message}`);
      }
    }
  } catch (err) {
    result.errors.push(`Feed fetch failed: ${err.message}`);
    log.error(`Feed fetch failed: ${err.message}`);
  }

  log.info(`Done. Added: ${result.added}, Skipped: ${result.skipped}, Errors: ${result.errors.length}`);
  return result;
}

// Allow direct execution
const isDirectRun = process.argv[1]?.includes('newsAgent');
if (isDirectRun) {
  run().then((r) => console.log('Result:', r)).catch(console.error);
}
