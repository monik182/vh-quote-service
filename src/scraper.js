const axios = require("axios");
const cheerio = require('cheerio');
const dotenv = require('dotenv');
dotenv.config();
const BASE_URL = process.env.BASE_URL;

async function scraper(url, data = '') {
  try {
    const res = await axios.get(url);

    if (res && res.data) {
      data += res.data;
      const $ = cheerio.load(res.data);
      const li = $('li');
      if (li.hasClass('next')) {
        return scraper(`${BASE_URL}${li.find($('.next a')).attr('href')}`, data);
      }
      return data;
    }

  } catch (e) {
    console.log('Error@Scraper', e);
  }
  return data;
}

async function scrapeAll(urlArray = []) {
  return await Promise.all(urlArray.map(url => axios.get(url)));
}

module.exports = { scraper, scrapeAll };
