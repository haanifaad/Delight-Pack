const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Capture API responses
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('.json')) {
      try {
        const text = await response.text();
        if (text.includes('category') || text.includes('price')) {
          console.log('--- FOUND API DATA AT:', url, '---');
          console.log(text.substring(0, 1000));
        }
      } catch (e) {
        // ignore
      }
    }
  });

  await page.goto('https://www.delightpackuae.com/products', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  
  const extracted = await page.evaluate(() => {
    // Try to find product elements
    // This is a generic guess. We'll also just grab all text to be safe.
    const texts = document.body.innerText;
    
    const elements = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const txt = el.innerText || '';
        return txt.toLowerCase().includes('dh') || txt.toLowerCase().includes('aed') || txt.toLowerCase().includes('$');
      })
      .map(el => ({ tag: el.tagName, className: el.className, text: el.innerText }));
      
    return { texts: texts.substring(0, 2000), elements: elements.slice(0, 10) };
  });

  console.log('--- PAGE TEXT EXTRACT ---');
  console.log(extracted.texts);
  console.log('--- PRICE ELEMENTS ---');
  console.log(JSON.stringify(extracted.elements, null, 2));

  await browser.close();
})();
