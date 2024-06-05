const puppeteer = require('puppeteer');

async function scrapeMedium(topic) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://medium.com/search?q=${encodeURIComponent(topic)}`);

  const articles = await page.evaluate(() => {
    const articleElements = Array.from(document.querySelectorAll('div.postArticle'));
    return articleElements.slice(0, 5).map(article => {
      const titleElement = article.querySelector('h3') || article.querySelector('h4');
      const title = titleElement ? titleElement.innerText : 'No title';
      const author = article.querySelector('a.ds-link').innerText;
      const publicationDate = article.querySelector('time').getAttribute('datetime');
      const url = article.querySelector('a').href;

      return { title, author, publicationDate, url };
    });
  });

  await browser.close();
  return articles;
}

module.exports = { scrapeMedium };
