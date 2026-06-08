const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');

function walkDir(dir, callback) {
  if(!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if(f === 'node_modules' || f.startsWith('.')) return;
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Fix the CSS Variables in the style block
    if (content.includes('--primary: #1D4ED8;')) {
      content = content.replace(/--primary: #1D4ED8;/g, '--primary: #123bb5;');
      hasChanges = true;
    }
    if (content.includes('--secondary: #E11D48;')) {
      content = content.replace(/--secondary: #E11D48;/g, '--secondary: #d81b21;');
      hasChanges = true;
    }
    
    // Fix the background color of the glowing orbs in the HTML
    if (content.includes('bg-[#1D4ED8]')) {
      content = content.split('bg-[#1D4ED8]').join('bg-[#123bb5]');
      hasChanges = true;
    }
    if (content.includes('bg-[#E11D48]')) {
      content = content.split('bg-[#E11D48]').join('bg-[#d81b21]');
      hasChanges = true;
    }

    // Fix the gradient in the Theme Switcher toggle pill
    if (content.includes('from-[#1D4ED8]')) {
      content = content.split('from-[#1D4ED8]').join('from-[#123bb5]');
      hasChanges = true;
    }
    if (content.includes('to-[#E11D48]')) {
      content = content.split('to-[#E11D48]').join('to-[#d81b21]');
      hasChanges = true;
    }
    if (content.includes('rgba(225, 29, 72, 0.15)')) { // Rose-600 shadow
       content = content.split('rgba(225, 29, 72, 0.15)').join('rgba(216, 27, 33, 0.15)'); // #d81b21
       hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated Colors in ${filePath}`);
    }
  }
});
