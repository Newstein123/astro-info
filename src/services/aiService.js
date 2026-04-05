import { GoogleGenAI } from '@google/genai';
import config from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('AI');
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

const BURMESE_INSTRUCTION = 'You are an astronomy and space science expert. All text content values in your JSON response MUST be written in Myanmar (Burmese) language unless specified otherwise.';

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function extractJSON(text) {
  try { return JSON.parse(text); } catch {}

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch {}
  }

  const objMatch = text.match(/(\{[\s\S]*\})/);
  if (objMatch) {
    try { return JSON.parse(objMatch[1]); } catch {}
  }

  return null;
}

async function generateJSON(prompt, maxTokens = 1024, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: config.textModel,
        contents: prompt,
        config: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          responseMimeType: 'application/json',
          systemInstruction: BURMESE_INSTRUCTION,
        },
      });

      const text = response.text?.trim();
      if (!text) throw new Error('Empty response');

      const parsed = extractJSON(text);
      if (!parsed) throw new Error('Could not parse JSON from response');
      return parsed;
    } catch (err) {
      log.warn(`Attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt < retries) await sleep(15000);
      else throw err;
    }
  }
}

export async function processNewsArticle(raw) {
  log.info(`Processing news: ${raw.title}`);
  const prompt = `Translate and process this space news article. Write title and summary in Burmese. Tags and category in English.

Original title: ${raw.title}
Original content: ${raw.content || raw.title}

Return JSON with keys: title (Burmese), summary (Burmese, 2-3 sentences), tags (English array), category (English slug)`;

  return generateJSON(prompt);
}

export async function generateTopic(existingTopics) {
  log.info(`Generating new topic (${existingTopics.length} existing)`);
  const topicList = existingTopics.length > 0
    ? `\nDo NOT pick any of these: ${existingTopics.join(', ')}`
    : '';

  const prompt = `Pick ONE unique astronomy or space science topic for an educational article.${topicList}

Respond with ONLY a JSON object like: {"topic": "English name", "topicBurmese": "Burmese name"}`;

  return generateJSON(prompt, 256);
}

export async function generateArticle(topic) {
  log.info(`Generating article for: ${topic}`);
  const prompt = `Write a detailed educational article about "${topic}". All text content in Burmese (Myanmar). Tags and category in English.

Return JSON with keys: title (Burmese), introduction (Burmese, 1 paragraph), explanation (Burmese, 3-5 paragraphs), keyFacts (array of 3 Burmese facts), tags (English array), category (English slug)`;

  return generateJSON(prompt, 8192);
}

export async function reviewEntry(entry, type) {
  log.info(`Reviewing ${type} entry: ${entry.id}`);
  const prompt = `Review this ${type} entry for quality, accuracy, and Burmese language clarity.

Entry: ${JSON.stringify(entry)}

Return JSON with keys: approved (boolean), improvements (object with improved Burmese fields or null values), reviewNotes (Burmese string)`;

  return generateJSON(prompt, 1024);
}
