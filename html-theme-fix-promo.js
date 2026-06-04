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

    // Fix the mobile app promo gradient
    const gradientTarget = 'bg-gradient-to-b from-obsidian-black to-[#050505]';
    if (content.includes(gradientTarget)) {
      content = content.split(gradientTarget).join('bg-card glass-card backdrop-blur-2xl');
      hasChanges = true;
    }

    // Also some files might have from-card to-[#050505] if my previous script half-replaced it.
    // wait, my previous script didn't replace from-obsidian-black.
    // Let's just do a regex to catch any remaining black gradients in that section:
    const regexGradient = /bg-gradient-to-b from-[a-z-]+ to-\[#[0-9a-fA-F]+\]/g;
    if (regexGradient.test(content)) {
      content = content.replace(regexGradient, 'bg-card glass-card backdrop-blur-2xl');
      hasChanges = true;
    }
    
    // Fix the app store buttons background (bg-black/50)
    const btnTarget = 'bg-black/50';
    if (content.includes(btnTarget)) {
      content = content.split(btnTarget).join('bg-muted hover:bg-card-hover');
      hasChanges = true;
    }
    
    if (content.includes('bg-white/5 blur-[120px]')) {
       // This is the fake glow inside the mobile promo. It looks bad in light mode.
       // Let's hide it in light mode or make it theme-aware. It's just a white blob.
       // We can change bg-white/5 to bg-foreground/5 so it's dark in light mode, light in dark mode.
       content = content.split('bg-white/5 blur-[120px]').join('bg-foreground/5 blur-[120px]');
       hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated Mobile App Promo in ${filePath}`);
    }
  }
});
