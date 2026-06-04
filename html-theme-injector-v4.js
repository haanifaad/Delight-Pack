const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public');

// The new Tailwind CSS block defining semantic variables for all themes
const newStyleBlock = `  <style type="text/tailwindcss">
    @theme {
      --color-primary: var(--primary);
      --color-primary-light: var(--primary-light);
      --color-primary-dark: var(--primary-dark);
      --color-secondary: var(--secondary);
      --color-background: var(--background);
      --color-foreground: var(--foreground);
      --color-card: var(--card);
      --color-card-hover: var(--card-hover);
      --color-border: var(--border);
      --color-muted: var(--muted);
      --color-muted-foreground: var(--muted-foreground);
      --color-accent: var(--accent);
      --font-sans: 'Inter', sans-serif;
    }

    /* DP Mode (Ultra Premium: Obsidian Black + Glassmorphism + DP Auras) */
    :root, [data-theme="dp"] {
      --primary: #1D4ED8; 
      --primary-light: #3b82f6;
      --primary-dark: #1e3a8a;
      --secondary: #E11D48;
      --background: #050505; /* Obsidian Black */
      --foreground: #fdfdfd;
      --card: rgba(255, 255, 255, 0.02); /* Glassmorphism Base */
      --card-hover: rgba(255, 255, 255, 0.05);
      --border: rgba(255, 255, 255, 0.08); /* Frosted edges */
      --muted: rgba(255, 255, 255, 0.05); 
      --muted-foreground: #94a3b8;
      --accent: #fdfdfd; /* Keep icons clean and white so they pop against the glows */
      color-scheme: dark;
    }

    /* Light Mode (Clean editorial white) */
    [data-theme="light"] {
      --primary: #0f172a;
      --primary-light: #334155;
      --primary-dark: #020617;
      --secondary: #475569;
      --background: #ffffff;
      --foreground: #1e293b;
      --card: #f8fafc;
      --card-hover: #f1f5f9;
      --border: #cbd5e1;
      --muted: #f1f5f9;
      --muted-foreground: #64748b;
      --accent: #0f172a;
      color-scheme: light;
    }

    /* Dark Mode (Grayscale, pure black/white) */
    [data-theme="dark"] {
      --primary: #ffffff; 
      --primary-light: #f1f5f9;
      --primary-dark: #cbd5e1;
      --secondary: #94a3b8;
      --background: #000000;
      --foreground: #ffffff;
      --card: #0a0a0a;
      --card-hover: #111111;
      --border: #1c1c1c;
      --muted: #1c1c1c;
      --muted-foreground: #a3a3a3;
      --accent: #ffffff;
      color-scheme: dark;
    }

    body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: var(--font-sans);
      transition: background-color 0.4s ease, color 0.4s ease;
      margin: 0;
      position: relative;
    }
    
    /* Aura logic */
    #dp-aura {
      display: none;
      position: fixed;
      inset: 0;
      z-index: -10;
      pointer-events: none;
      overflow: hidden;
    }
    [data-theme="dp"] #dp-aura {
      display: block;
    }
    
    /* Cinematic Glass Card Hover Glow for DP Mode */
    [data-theme="dp"] .glass-card {
      transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
    }
    [data-theme="dp"] .glass-card:hover {
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 40px -10px rgba(29, 78, 216, 0.15), 0 0 30px -10px rgba(225, 29, 72, 0.15);
    }
    
    .icon-accent {
      color: var(--accent);
    }
    
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.2; transform: scale(1); }
      50% { opacity: 0.35; transform: scale(1.05); }
    }
    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }
  </style>
  <script>
    (function() {
      const savedTheme = localStorage.getItem('theme-mode');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dp');
      }
    })();
  </script>`;

const auraHtml = `
  <!-- Ambient DP Aura Glow (Only visible in DP Mode) -->
  <div id="dp-aura">
    <div class="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#1D4ED8] rounded-full mix-blend-screen filter blur-[140px] animate-pulse-slow" style="opacity: 0.25;"></div>
    <div class="absolute bottom-[-15%] right-[-10%] w-[800px] h-[800px] bg-[#E11D48] rounded-full mix-blend-screen filter blur-[180px] animate-pulse-slow" style="opacity: 0.2;"></div>
  </div>`;

const switcherHtml = `
  <!-- Premium Pill Theme Switcher -->
  <div id="theme-switcher-container" style="position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 9999;">
    <div class="flex items-center gap-1 p-1 bg-card/80 backdrop-blur-2xl border border-border rounded-full shadow-2xl">
      <button onclick="setTheme('dp')" id="btn-dp" class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all text-muted-foreground hover:text-foreground">
        <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#1D4ED8] to-[#E11D48] shadow-[0_0_10px_rgba(29,78,216,0.5)]"></span>
        DP Mode
      </button>
      <button onclick="setTheme('light')" id="btn-light" class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all text-muted-foreground hover:text-foreground">
        <i data-lucide="sun" class="w-4 h-4"></i>
        Light
      </button>
      <button onclick="setTheme('dark')" id="btn-dark" class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all text-muted-foreground hover:text-foreground">
        <i data-lucide="moon" class="w-4 h-4"></i>
        Dark
      </button>
    </div>
  </div>
  <script>
    function setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme-mode', theme);
      updateSwitcherUI(theme);
    }

    function updateSwitcherUI(theme) {
      const btns = ['dp', 'light', 'dark'];
      btns.forEach(t => {
        const btn = document.getElementById('btn-' + t);
        if(!btn) return;
        if(t === theme) {
          btn.classList.add('bg-background', 'text-foreground', 'shadow-sm');
          btn.classList.remove('text-muted-foreground');
        } else {
          btn.classList.remove('bg-background', 'text-foreground', 'shadow-sm');
          btn.classList.add('text-muted-foreground');
        }
      });
      if(window.lucide) window.lucide.createIcons();
    }

    document.addEventListener('DOMContentLoaded', () => {
      let currentTheme = localStorage.getItem('theme-mode') || 'dp';
      updateSwitcherUI(currentTheme);
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

    // Replace the style block
    const styleRegex = /<style type="text\/tailwindcss">[\s\S]*?<\/style>/i;
    if (styleRegex.test(content)) {
      content = content.replace(styleRegex, newStyleBlock);
      hasChanges = true;
    }
    
    // Update Theme Switcher block
    const switcherRegex = /<!-- Premium Pill Theme Switcher -->[\s\S]*?<\/script>/i;
    if (switcherRegex.test(content)) {
      content = content.replace(switcherRegex, switcherHtml);
      hasChanges = true;
    }

    // Inject Aura if missing
    if (!content.includes('id="dp-aura"')) {
      // Find the body tag and inject right after it
      const bodyTagRegex = /<body[^>]*>/i;
      const bodyMatch = content.match(bodyTagRegex);
      if (bodyMatch) {
        content = content.replace(bodyMatch[0], bodyMatch[0] + '\n' + auraHtml);
        hasChanges = true;
      }
    } else {
      // Ensure it's updated to latest aura html
      const auraRegex = /<!-- Ambient DP Aura Glow[\s\S]*?<\/div>\s*<\/div>/i;
      if (auraRegex.test(content)) {
         content = content.replace(auraRegex, auraHtml.trim());
         hasChanges = true;
      }
    }

    // Upgrade cards to glassmorphism
    // Since previous scripts replaced bg-obsidian-black with bg-card, we will just ensure they have glass-card and backdrop-blur-2xl
    if (content.includes('bg-card')) {
      const parts = content.split('bg-card');
      // We don't want to duplicate backdrop-blur if it already exists from a previous run, but wait, the previous run didn't add it.
      let newParts = [parts[0]];
      for(let i=1; i<parts.length; i++) {
        if (!parts[i].includes('backdrop-blur-2xl')) {
          newParts.push(' backdrop-blur-2xl glass-card' + parts[i]);
        } else {
          newParts.push(parts[i]);
        }
      }
      const joined = newParts.join('bg-card');
      if (joined !== content) {
        content = joined;
        hasChanges = true;
      }
    }
    
    // We previously mapped some icons to icon-accent. They will stay icon-accent, which is now #fdfdfd (white) in DP mode
    // because the background is vibrant and colorful enough, we want the icons and text to stay pure white so it's readable.
    // Wait, the previous script mapped `icon-accent group-hover:text-primary-light`. 
    // This is perfect, because hover will turn it blue.
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
