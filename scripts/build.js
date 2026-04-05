import { cpSync, mkdirSync } from 'fs';

// Build static site into dist/
mkdirSync('dist', { recursive: true });

// Copy frontend files
cpSync('public', 'dist', { recursive: true });

// Copy data files so frontend can fetch them directly
mkdirSync('dist/api', { recursive: true });
cpSync('data/news.json', 'dist/api/news.json');
cpSync('data/content.json', 'dist/api/content.json');

console.log('Build complete → dist/');
