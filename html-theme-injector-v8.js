const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');

const newAuraHtml = `
  <!-- Ambient Interactive DP Aura Glow (Unified Parallax) -->
  <div id="dp-aura" class="fixed inset-0 overflow-hidden pointer-events-none z-[-10]">
    <div id="dp-orb-blue" class="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-[#123bb5] rounded-full mix-blend-screen filter blur-[150px] opacity-30" style="transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);"></div>
    <div id="dp-orb-red" class="absolute bottom-[-15%] right-[-10%] w-[1000px] h-[1000px] bg-[#d81b21] rounded-full mix-blend-screen filter blur-[200px] opacity-20" style="transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1);"></div>
  </div>
  <script>
    document.addEventListener('mousemove', (e) => {
      if (document.documentElement.getAttribute('data-theme') !== 'dp') return;
      
      const blueOrb = document.getElementById('dp-orb-blue');
      const redOrb = document.getElementById('dp-orb-red');
      
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      
      if (blueOrb) blueOrb.style.transform = \`translate(\${x * 150}px, \${y * 150}px)\`;
      if (redOrb) redOrb.style.transform = \`translate(\${x * 120}px, \${y * 120}px)\`;
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
    
    const strStart = '<!-- Ambient Interactive DP Aura Glow (Subtle Parallax) -->';
    const strEnd = '</script>';

    let startIdx = content.indexOf(strStart);
    if (startIdx !== -1) {
        let endIdx = content.indexOf(strEnd, startIdx) + strEnd.length;
        content = content.substring(0, startIdx) + newAuraHtml.trim() + content.substring(endIdx);
        hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated Unified Parallax in ${filePath}`);
    }
  }
});
