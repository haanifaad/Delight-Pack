const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');

const newAuraHtml = `
  <!-- Ambient Interactive DP Aura Glow (Subtle Parallax) -->
  <div id="dp-aura" class="fixed inset-0 overflow-hidden pointer-events-none z-[-10]">
    <div id="dp-orb-blue" class="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-[#123bb5] rounded-full mix-blend-screen filter blur-[150px] opacity-30" style="transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);"></div>
    <div id="dp-orb-red" class="absolute bottom-[-15%] right-[-10%] w-[1000px] h-[1000px] bg-[#d81b21] rounded-full mix-blend-screen filter blur-[200px] opacity-20" style="transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1);"></div>
  </div>
  <script>
    document.addEventListener('mousemove', (e) => {
      if (document.documentElement.getAttribute('data-theme') !== 'dp') return;
      
      const blueOrb = document.getElementById('dp-orb-blue');
      const redOrb = document.getElementById('dp-orb-red');
      
      // Calculate mouse position relative to center of screen (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      
      // Subtle parallax shift (e.g. max 100px movement)
      if (blueOrb) blueOrb.style.transform = \`translate(\${x * 150}px, \${y * 150}px)\`;
      if (redOrb) redOrb.style.transform = \`translate(\${x * -100}px, \${y * -100}px)\`;
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
    
    // We need to replace the V5/V6 aura with this V7 aura.
    // In javascript regex, `.` does not match newlines. Use [\s\S]*?
    const auraRegex = /<!-- Ambient Interactive DP Aura Glow[\s\S]*?<div id="dp-aura">[\s\S]*?<\/script>/i;
    if (auraRegex.test(content)) {
      content = content.replace(auraRegex, newAuraHtml.trim());
      hasChanges = true;
    } else {
       // Also look for older blocks if they somehow didn't update
       const oldAuraRegex = /<!-- Ambient DP Aura Glow[\s\S]*?<div id="dp-aura">[\s\S]*?<\/div>\s*<\/div>/i;
       if (oldAuraRegex.test(content)) {
         content = content.replace(oldAuraRegex, newAuraHtml.trim());
         hasChanges = true;
       }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Restored Composition in ${filePath}`);
    }
  }
});
