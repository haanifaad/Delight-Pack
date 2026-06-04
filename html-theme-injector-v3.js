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

    /* DP Mode (Fully utilizing the DP Logo Palette) */
    :root, [data-theme="dp"] {
      --primary: #123bb5; /* DP Blue */
      --primary-light: #2563eb;
      --primary-dark: #1e3a8a;
      --secondary: #d81b21; /* DP Red */
      --background: #060b19; /* Extremely deep blue/black background */
      --foreground: #f0f4ff; /* Slight blue tint to white text */
      --card: #0c1631; /* Deep blue cards */
      --card-hover: #14244b; /* Brighter blue on hover */
      --border: #1e3a8a; /* Blue borders */
      --muted: #1e3a8a; 
      --muted-foreground: #93a5d1;
      --accent: #d81b21; /* Red accents for icons/highlights */
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
      transition: background-color 0.3s ease, color 0.3s ease;
      margin: 0;
    }
    
    /* Global accent class for icons to pop in DP mode */
    .icon-accent {
      color: var(--accent);
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

const switcherHtml = `
  <!-- Premium Pill Theme Switcher -->
  <div id="theme-switcher-container" style="position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 9999;">
    <div class="flex items-center gap-1 p-1 bg-card/80 backdrop-blur-xl border border-border rounded-full shadow-2xl">
      <button onclick="setTheme('dp')" id="btn-dp" class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all text-muted-foreground hover:text-foreground">
        <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#123bb5] to-[#d81b21] shadow-sm"></span>
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

    // Replace hardcoded icon colors so they pop with the DP Red accent
    // Instead of text-foreground on lucide icons, make them icon-accent
    if (content.includes('text-foreground"></i>')) {
      content = content.split('text-foreground"></i>').join('icon-accent"></i>');
      hasChanges = true;
    }
    if (content.includes('text-foreground group-hover:text-slate-300')) {
      content = content.split('text-foreground group-hover:text-slate-300').join('icon-accent group-hover:text-primary-light');
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
