const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public', 'webpages', 'dp', 'webpages', 'src');

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
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Backgrounds
    if (content.includes('bg-white')) {
      content = content.replace(/bg-white/g, 'bg-card glass-card backdrop-blur-2xl');
      hasChanges = true;
    }
    if (content.includes('bg-slate-50')) {
      content = content.replace(/bg-slate-50/g, 'bg-background');
      hasChanges = true;
    }
    if (content.includes('bg-gray-50')) {
      content = content.replace(/bg-gray-50/g, 'bg-background');
      hasChanges = true;
    }
    
    // Text
    if (content.includes('text-slate-900')) {
      content = content.replace(/text-slate-900/g, 'text-foreground');
      hasChanges = true;
    }
    if (content.includes('text-gray-900')) {
      content = content.replace(/text-gray-900/g, 'text-foreground');
      hasChanges = true;
    }
    if (content.includes('text-slate-800')) {
      content = content.replace(/text-slate-800/g, 'text-foreground');
      hasChanges = true;
    }
    if (content.includes('text-slate-700')) {
      content = content.replace(/text-slate-700/g, 'text-foreground');
      hasChanges = true;
    }
    if (content.includes('text-slate-600')) {
      content = content.replace(/text-slate-600/g, 'text-muted-foreground');
      hasChanges = true;
    }
    if (content.includes('text-slate-500')) {
      content = content.replace(/text-slate-500/g, 'text-muted-foreground');
      hasChanges = true;
    }
    if (content.includes('text-gray-600')) {
      content = content.replace(/text-gray-600/g, 'text-muted-foreground');
      hasChanges = true;
    }
    if (content.includes('text-gray-500')) {
      content = content.replace(/text-gray-500/g, 'text-muted-foreground');
      hasChanges = true;
    }
    
    // Borders
    if (content.includes('border-slate-100')) {
      content = content.replace(/border-slate-100/g, 'border-border');
      hasChanges = true;
    }
    if (content.includes('border-slate-200')) {
      content = content.replace(/border-slate-200/g, 'border-border');
      hasChanges = true;
    }
    if (content.includes('border-gray-100')) {
      content = content.replace(/border-gray-100/g, 'border-border');
      hasChanges = true;
    }
    if (content.includes('border-gray-200')) {
      content = content.replace(/border-gray-200/g, 'border-border');
      hasChanges = true;
    }
    
    // Primary Button specific hacks (bg-slate-900 text-white)
    // We want these to become primary color or inverted
    if (content.includes('bg-card glass-card backdrop-blur-2xl text-white') && content.includes('bg-slate-900')) {
       // Our previous replace changed 'bg-white' to 'bg-card...'. If the button was 'text-white bg-slate-900', it would now be 'text-[bg-card...] bg-slate-900', wait no: text-white -> text-white is untouched.
    }
    
    // Actually, bg-slate-900 text-white was used for the portal login button.
    if (content.includes('bg-slate-900')) {
      content = content.replace(/bg-slate-900/g, 'bg-primary');
      hasChanges = true;
    }
    if (content.includes('hover:bg-slate-800')) {
      content = content.replace(/hover:bg-slate-800/g, 'hover:bg-primary-light');
      hasChanges = true;
    }
    
    // Fix text-white if it's on a primary button
    if (content.includes('text-white')) {
       // We leave text-white alone because primary buttons in all themes probably want white text.
    }
    
    // Fix pure white background if used
    if (content.includes('min-h-screen bg-card glass-card backdrop-blur-2xl')) {
       // The min-h-screen container shouldn't be a glass card, it should be bg-background
       content = content.replace(/min-h-screen bg-card glass-card backdrop-blur-2xl/g, 'min-h-screen bg-background text-foreground');
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated SPA Component: ${filePath}`);
    }
  }
});
