import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import config from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('Storage');

function getFilePath(type) {
  return join(config.dataDir, `${type}.json`);
}

export async function read(type) {
  const filePath = getFilePath(type);
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      log.warn(`${filePath} not found, returning empty array`);
      return [];
    }
    throw err;
  }
}

export async function append(type, entries) {
  const existing = await read(type);
  const updated = [...existing, ...entries];
  const filePath = getFilePath(type);
  await writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
  log.info(`Appended ${entries.length} entries to ${type}.json (total: ${updated.length})`);
}

export async function update(type, fullArray) {
  const filePath = getFilePath(type);
  await writeFile(filePath, JSON.stringify(fullArray, null, 2), 'utf-8');
  log.info(`Updated ${type}.json with ${fullArray.length} entries`);
}

export async function exists(type, key, value) {
  const data = await read(type);
  return data.some((entry) => entry[key] === value);
}
