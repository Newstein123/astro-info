import 'dotenv/config';

const config = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  textModel: 'gemini-2.5-flash',
  imagenModel: 'imagen-4.0-fast-generate-001',

  dataDir: './data',

  rssFeeds: [
    { name: 'NASA Breaking News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss' },
    { name: 'Space.com', url: 'https://feeds.feedburner.com/spacecom' },
    { name: 'ScienceDaily Space', url: 'https://www.sciencedaily.com/rss/space_time.xml' },
  ],

  schedule: {
    news: '0 8 * * *',
    content: '0 9 * * *',
    review: '0 10 * * *',
  },

  limits: {
    maxNewsPerRun: 5,
    maxReviewsPerRun: 10,
  },

  server: {
    port: process.env.PORT || 3000,
  },
};

export default config;
