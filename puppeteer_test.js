const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('file:///C:/Projects/dp/public/app/index.html#/careers', { waitUntil: 'networkidle2' });

  const rootHTML = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log('Root HTML length:', rootHTML.length);

  if (rootHTML.length === 0) {
    console.log('Root is empty. Body innerHTML:');
    console.log(await page.evaluate(() => document.body.innerHTML));
  }

  await browser.close();
})();
