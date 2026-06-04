/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-expressions */
const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'components');

const replacements = {
  'bg-black': 'bg-background',
  'text-white': 'text-foreground',
  'bg-[#0a0a0a]': 'bg-card',
  'bg-[#111111]': 'bg-card-hover',
  'bg-[#1c1c1c]': 'bg-muted',
  'border-[#1c1c1c]': 'border-border',
  'text-slate-400': 'text-muted-foreground',
  'text-slate-500': 'text-muted-foreground',
};

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(directoryPath, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`(?<=[\\s"'\\\`])(${key.replace(/\[/g, '\\\[').replace(/\]/g, '\\\]')})(?=[\\s"'\\\`])`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, value);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');

    }
  }
});
