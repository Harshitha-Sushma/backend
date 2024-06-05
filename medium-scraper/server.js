const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { scrapeMedium } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let articlesCache = [];

app.post('/scrape', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }
  try {
    const articles = await scrapeMedium(topic);
    articlesCache = articles;
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape articles' });
  }
});

app.get('/articles', (req, res) => {
  res.json(articlesCache);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
