const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log("Launching puppeteer...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  let productsJson = null;

  // Intercept all responses to find the products data
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('products') && (url.includes('.json') || url.includes('api'))) {
      try {
        const text = await response.text();
        if (text.includes('category') || text.includes('price')) {
          console.log(`[intercept] Found possible products JSON from: ${url}`);
          productsJson = text;
        }
      } catch (e) {
        // ignore errors reading response
      }
    }
  });

  console.log("Navigating to https://www.delightpackuae.com/products...");
  await page.goto('https://www.delightpackuae.com/products', { waitUntil: 'networkidle0', timeout: 30000 });
  
  if (!productsJson) {
    console.log("No JSON intercepted, falling back to DOM scraping...");
    // Let's scroll down to load everything if it's infinite scroll
    await autoScroll(page);
    
    // Scrape all text that might contain categories/products
    const data = await page.evaluate(() => {
      // Find all text elements and try to extract structure
      const items = [];
      const els = document.querySelectorAll('*');
      for (const el of els) {
        // Very basic heuristic
        if (el.innerText && (el.innerText.includes('AED') || el.innerText.includes('$') || el.innerText.includes('Dh'))) {
           if (el.children.length === 0 || (el.children.length < 5 && el.innerText.length < 200)) {
               items.push({
                 text: el.innerText.trim(),
                 html: el.innerHTML.substring(0, 100),
                 className: el.className
               });
           }
        }
      }
      return items;
    });
    
    fs.writeFileSync('dom-scrape-results.json', JSON.stringify(data, null, 2));
    console.log("DOM scrape saved to dom-scrape-results.json");
  } else {
    fs.writeFileSync('api-products.json', productsJson);
    console.log("API JSON saved to api-products.json");
  }

  await browser.close();
  console.log("Done.");
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
