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
    
    // We replace the small multipliers with large ones
    if (content.includes('x * 150')) {
      content = content.replace(/x \* 150/g, 'x * 800');
      content = content.replace(/y \* 150/g, 'y * 800');
      hasChanges = true;
    }
    if (content.includes('x * 120')) {
      content = content.replace(/x \* 120/g, 'x * 650');
      content = content.replace(/y \* 120/g, 'y * 650');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Amplified Parallax in ${filePath}`);
    }
  }
});
