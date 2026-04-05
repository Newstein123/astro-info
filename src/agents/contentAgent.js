import * as ai from '../services/aiService.js';
import * as image from '../services/imageService.js';
import * as storage from '../services/storageService.js';
import { generateId } from '../utils/idGenerator.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('ContentAgent');

export async function run() {
  log.info('Starting content agent...');

  try {
    const existing = await storage.read('content');
    const existingTopics = existing.map((e) => e.topic);

    const topicResult = await ai.generateTopic(existingTopics);
    const topic = topicResult.topic;
    log.info(`Selected topic: ${topic}`);

    const normalizedTopic = topic.toLowerCase().trim();
    const isDuplicate = existingTopics.some(
      (t) => t.toLowerCase().trim() === normalizedTopic
    );
    if (isDuplicate) {
      log.warn(`Topic "${topic}" already exists, skipping`);
      return { topic, success: false, error: 'duplicate topic' };
    }

    const article = await ai.generateArticle(topic);
    const id = generateId('content', topic);
    const imagePath = await image.generate(id, topic);

    const entry = {
      id,
      topic,
      title: article.title,
      introduction: article.introduction,
      explanation: article.explanation,
      keyFacts: article.keyFacts || [],
      tags: article.tags || [],
      category: article.category || 'astronomy',
      image: imagePath,
      createdAt: new Date().toISOString(),
      reviewed: false,
      reviewNotes: null,
    };

    await storage.append('content', [entry]);
    log.info(`Created article: ${entry.title}`);
    return { topic, success: true };
  } catch (err) {
    log.error(`Content generation failed: ${err.message}`);
    return { topic: null, success: false, error: err.message };
  }
}

const isDirectRun = process.argv[1]?.includes('contentAgent');
if (isDirectRun) {
  run().then((r) => console.log('Result:', r)).catch(console.error);
}
