const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');

const newAuraHtml = `
  <!-- Ambient Interactive DP Aura Glow (Only visible in DP Mode) -->
  <div id="dp-aura">
    <div id="dp-orb-blue" class="fixed top-0 left-0 w-[600px] h-[600px] -ml-[300px] -mt-[300px] bg-[#1D4ED8] rounded-full mix-blend-screen filter blur-[140px] opacity-30 pointer-events-none" style="transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
    <div id="dp-orb-red" class="fixed top-0 left-0 w-[800px] h-[800px] -ml-[400px] -mt-[400px] bg-[#E11D48] rounded-full mix-blend-screen filter blur-[180px] opacity-20 pointer-events-none" style="transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);"></div>
  </div>
  <script>
    document.addEventListener('mousemove', (e) => {
      // Only track if DP Mode is active to save performance in other modes
      if (document.documentElement.getAttribute('data-theme') !== 'dp') return;
      
      const blueOrb = document.getElementById('dp-orb-blue');
      const redOrb = document.getElementById('dp-orb-red');
      
      const x = e.clientX;
      const y = e.clientY;
      
      // Blue orb perfectly centers on the mouse
      if (blueOrb) blueOrb.style.transform = \`translate(\${x}px, \${y}px)\`;
      
      // Red orb trails slightly and offsets to create a stunning blended effect
      if (redOrb) redOrb.style.transform = \`translate(\${x + 80}px, \${y + 80}px)\`;
    });
  </script>`;

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
    
    // The previous aura was:
    // <div id="dp-aura">
    //   <div class="absolute ..."></div>
    //   <div class="absolute ..."></div>
    // </div>
    // We will use a regex to capture <div id="dp-aura"> ... </div> and replace it.
    
    const auraRegex = /<!-- Ambient DP Aura Glow.*?<div id="dp-aura">[\s\S]*?<\/div>\s*<\/div>/i;
    
    if (auraRegex.test(content)) {
      content = content.replace(auraRegex, newAuraHtml.trim());
      hasChanges = true;
    } else {
       // if we can't find it exactly by comment, look for just the div
       const divAuraRegex = /<div id="dp-aura">[\s\S]*?<\/div>\s*<\/div>/i;
       if (divAuraRegex.test(content)) {
         content = content.replace(divAuraRegex, newAuraHtml.trim());
         hasChanges = true;
       }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated Interactive Aura in ${filePath}`);
    }
  }
});
