import { createHash } from 'crypto';

export function generateId(prefix, seed) {
  const hash = createHash('sha256').update(seed).digest('hex').slice(0, 8);
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}-${date}-${hash}`;
}
