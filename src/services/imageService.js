import { GoogleGenAI } from '@google/genai';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import config from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Image');
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

const IMAGE_DIR = './public/images';

export async function generate(id, description) {
  log.info(`Generating image for: ${description}`);

  const prompt = `${description}. Astronomy, space, photorealistic, vibrant colors, detailed. Absolutely no text, no words, no letters, no labels, no watermarks anywhere in the image.`;

  try {
    await mkdir(IMAGE_DIR, { recursive: true });

    const response = await ai.models.generateImages({
      model: config.imagenModel,
      prompt,
      config: { numberOfImages: 1 },
    });

    const imageData = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imageData) {
      log.warn(`No image data returned for ${id}`);
      return null;
    }

    const fileName = `${id}.png`;
    const filePath = join(IMAGE_DIR, fileName);
    await writeFile(filePath, Buffer.from(imageData, 'base64'));

    log.info(`Saved image: ${filePath}`);
    return `/images/${fileName}`;
  } catch (err) {
    log.error(`Image generation failed for ${id}: ${err.message}`);
    return null;
  }
}
