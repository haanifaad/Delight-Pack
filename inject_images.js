const fs = require('fs');

const data = JSON.parse(fs.readFileSync('products_api.json')).data;

const products = data.map((p, index) => {
  let cat = 'pet_jars'; // default
  const name = (p.name || '').toUpperCase();
  
  if (name.includes('GLASS JAR') || name.includes('HEX')) {
    cat = 'glass_jars';
  } else if (name.includes('PET JAR') || name.includes('CONSUMER JAR')) {
    cat = 'pet_jars';
  } else if (name.includes('WATER BOTTLE') || name.includes('SWING BOTTLE')) {
    cat = 'water_bottles';
  } else if (name.includes('JUICE BOTTLE')) {
    cat = 'juice_bottles';
  } else if (name.includes('MILK') || name.includes('OIL') || name.includes('FLAT')) {
    cat = 'milk_oil';
  } else if (name.includes('BOX') || name.includes('PAPER') || name.includes('PACKING')) {
    cat = 'packings';
  } else if (name.includes('STRAW') || name.includes('CUTLERY')) {
    cat = 'cutlery';
  } else if (name.includes('CUSTOM')) {
    cat = 'custom';
  } else if (name.includes('BOTTLE')) {
    cat = 'water_bottles'; // generic fallback for bottles
  }

  const images = [];
  if (p.images && p.images.length > 0) {
    p.images.forEach(img => {
      if (img.image_url) images.push(img.image_url);
    });
  }
  
  return {
    id: String(p.id),
    category: cat,
    name: p.name,
    price: p.price ? parseFloat(p.price) : (Math.floor(Math.random() * 15) + 5.99),
    description: p.description ? p.description.substring(0, 100) : '',
    tag: p.offer ? 'SALE' : (index % 5 === 0 ? 'NEW' : null),
    bestseller: index % 4 === 0,
    images: images
  };
});

let app = fs.readFileSync('kiosk_frontend/src/App.tsx', 'utf8');

// Replace DEFAULT_PRODUCTS array
app = app.replace(/const DEFAULT_PRODUCTS = \[[\s\S]*?\];/, 'const DEFAULT_PRODUCTS = ' + JSON.stringify(products, null, 2) + ';');

// Bump cache version from V4 to V5
app = app.replace(/'DP_PRODUCTS_V4'/g, "'DP_PRODUCTS_V5'");

fs.writeFileSync('kiosk_frontend/src/App.tsx', app);
console.log('App.tsx updated successfully with new categories. Formatted ' + products.length + ' products.');
