const PUPPETEER = require('puppeteer');

beforeAll(async function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60001;
  global.browser = await PUPPETEER.launch({
      headless: true
  });
  global.page = await browser.newPage();
});
