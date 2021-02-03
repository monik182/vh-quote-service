const cheerio = require('cheerio');
const { normalizeAuthor } = require('./helpers.js');
const dotenv = require('dotenv');
dotenv.config({ path: '../' });
const BASE_URL = process.env.BASE_URL;

function quoteFormatter(rawData) {
  const $ = cheerio.load(rawData);
  return $('div.quote').map((i, el) => (
    {
      author: $(el).find('span small.author').text().trim(),
      text: $(el).find('span.text').text().trim().slice(0, 50),
      tags: $(el).find('meta').attr('content').split(',')
    }
  )).get();
}

function authorFormatter(rawData) {
  const $ = cheerio.load(rawData);
  const el = $('div.author-details');
  const name = el.find('h3.author-title').text().trim();
  if (name) {
    return [{
      name,
      biography: el.find('div.author-description').text().trim().slice(0, 50),
      birthdate: el.find('span.author-born-date').text().trim(),
      location: el.find('span.author-born-location').text().trim(),
    }];
  }
  return [];
}

function authorNameOnlyFormatter(rawData) {
  const $ = cheerio.load(rawData);
  const data = {};
  $('div.quote').each((i, item) => {
    const name = normalizeAuthor($(item).find('span small.author').text().trim());
    if (!data[name]) {
      data[name] = `${BASE_URL}/author/${name}`;
    }
  });
  return Object.values(data);
}

module.exports = { quoteFormatter, authorFormatter, authorNameOnlyFormatter };
