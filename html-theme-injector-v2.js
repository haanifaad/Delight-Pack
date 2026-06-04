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
      --font-sans: 'Inter', sans-serif;
    }

    /* DP Mode (Premium Dark with DP Blue/Red accents) */
    :root, [data-theme="dp"] {
      --primary: #1D4ED8; /* DP Blue */
      --primary-light: #3b82f6;
      --primary-dark: #1e3a8a;
      --secondary: #E11D48; /* DP Red */
      --background: #050505; /* Sleek obsidian */
      --foreground: #fdfdfd;
      --card: #0a0a0a;
      --card-hover: #111111;
      --border: #1c1c1c;
      --muted: #1c1c1c;
      --muted-foreground: #94a3b8;
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
      color-scheme: light;
    }

    /* Dark Mode (Grayscale, no DP brand colors) */
    [data-theme="dark"] {
      --primary: #3b82f6; 
      --primary-light: #60a5fa;
      --primary-dark: #2563eb;
      --secondary: #f43f5e;
      --background: #000000;
      --foreground: #fdfdfd;
      --card: #0a0a0a;
      --card-hover: #111111;
      --border: #1c1c1c;
      --muted: #1c1c1c;
      --muted-foreground: #94a3b8;
      color-scheme: dark;
    }

    body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: var(--font-sans);
      transition: background-color 0.3s ease, color 0.3s ease;
      margin: 0;
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
        <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#1D4ED8] to-[#E11D48] shadow-sm shadow-blue-500/50"></span>
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

const replacements = {
  'bg-pitch-black': 'bg-background',
  'bg-[#000]': 'bg-background',
  'bg-obsidian-black': 'bg-card',
  'bg-[#0a0a0a]': 'bg-card',
  'hover:bg-[#111111]': 'hover:bg-card-hover',
  'bg-b2b-gray': 'bg-muted',
  'border-b2b-gray': 'border-border',
  'border-[#1c1c1c]': 'border-border',
  'text-editorial-white': 'text-foreground',
  'text-slate-400': 'text-muted-foreground',
  'text-slate-500': 'text-muted-foreground',
};

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
    
    // Remove old V1 theme switcher logic if present
    const oldSwitcherStart = content.indexOf('<!-- Theme Switcher -->');
    if (oldSwitcherStart !== -1) {
      const closingBody = content.indexOf('</body>', oldSwitcherStart);
      if (closingBody !== -1) {
        content = content.substring(0, oldSwitcherStart) + content.substring(closingBody);
        hasChanges = true;
      }
    }

    // Also try to catch any malformed \n</body> that my previous script might have left
    content = content.split('\\n</body>').join('</body>');

    // Replace <style type="text/tailwindcss"> block completely if it exists
    const styleRegex = /<style type="text\/tailwindcss">[\s\S]*?<\/style>/i;
    if (styleRegex.test(content)) {
      content = content.replace(styleRegex, newStyleBlock);
      hasChanges = true;
    } else {
      // If no style block exists, inject it before </head>
      if(content.includes('</head>')) {
        content = content.replace('</head>', newStyleBlock + '\\n</head>');
        hasChanges = true;
      }
    }
    
    // Also remove the old init script if it got duplicated
    const initScriptRegex = /<script>[\s\S]*?theme-mode[\s\S]*?<\/script>/gi;
    let match;
    let matchCount = 0;
    while ((match = initScriptRegex.exec(content)) !== null) {
      matchCount++;
      // We know newStyleBlock contains one copy. If we find more than one globally, we have a problem.
      // But it's easier to just strip them all and add it to newStyleBlock which is done above.
    }
    
    // Replace class names explicitly using split/join
    for (const [key, value] of Object.entries(replacements)) {
      if (content.includes(key)) {
        content = content.split(key).join(value);
        hasChanges = true;
      }
    }

    // Inject New Premium Theme Switcher before </body>
    if (content.includes('</body>') && !content.includes('Premium Pill Theme Switcher')) {
      content = content.split('</body>').join(switcherHtml + '\n</body>');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
