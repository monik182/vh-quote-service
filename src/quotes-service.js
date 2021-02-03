const express = require('express');
const { scraper, scrapeAll } = require('./scraper.js');
const { quoteFormatter, authorFormatter, authorNameOnlyFormatter } = require('./formatter.js');
const { normalizeAuthor } = require('./helpers.js');
const dotenv = require('dotenv');
dotenv.config({ path: '../' });
const BASE_URL = process.env.BASE_URL;

const createService = () => {
  const app = express();

  app.get('/quotes', async (req, res) => {
    const {author, tag} = req.query;

    try {
      const scrapedData = await (tag ? scraper(`${BASE_URL}/tag/${tag}`) : scraper(BASE_URL));
      let data = quoteFormatter(scrapedData);

      if (author) {
        data = data.filter(el => el.author === author);
      }

      res.json({data});
    } catch (e) {
      console.log(`Error@getQuotes => author: ${author}, tag: ${tag}`, e);
      res.json(e.response.status, `Error@getQuotes => author: ${author}, tag: ${tag} => ${e.response.statusText}`);
    }

  });

  app.get('/authors', async (req, res) => {
    const {name} = req.query;

    if (name) {
      try {
        const scrapedData = await scraper(`${BASE_URL}/author/${normalizeAuthor(name)}`);
        const data = authorFormatter(scrapedData);
        res.json(200, {data});
      } catch (e) {
        console.log(`Error@getAuthor: ${name}`, e);
        res.json(e.response.status, `Error@getAuthor: ${e.response.statusText}`);
      }

    } else {
      const scrapedData = await scraper(BASE_URL);
      let data = authorNameOnlyFormatter(scrapedData);

      try {
        const response = await scrapeAll(data.map(author => `${BASE_URL}/author/${author}`));
        data = response.reduce((prev, curr) => {
            if (curr.status >= 200 && curr.status < 300 && curr.data) {
              prev.push(authorFormatter(curr.data));
            }
            return prev;
          }, []);
        res.json(200, {data});
      } catch (e) {
        console.log('Error@scrapeAll', e.response);
        res.json(e.response.status, `Error@scrapeAll => ${e.response.statusText}`);
      }
    }
  });

  return app;
};

module.exports = { createService };
