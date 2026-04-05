import Parser from 'rss-parser';
import config from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('RSS');
const parser = new Parser();

export async function fetchFeeds() {
  const articles = [];

  for (const feed of config.rssFeeds) {
    try {
      log.info(`Fetching: ${feed.name}`);
      const result = await parser.parseURL(feed.url);

      for (const item of result.items || []) {
        articles.push({
          title: item.title || '',
          link: item.link || '',
          content: item.contentSnippet || item.content || '',
          pubDate: item.pubDate || item.isoDate || '',
          source: feed.name,
          sourceUrl: feed.url,
        });
      }

      log.info(`Got ${result.items?.length || 0} articles from ${feed.name}`);
    } catch (err) {
      log.error(`Failed to fetch ${feed.name}: ${err.message}`);
    }
  }

  return articles;
}
