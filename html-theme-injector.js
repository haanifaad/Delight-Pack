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

    :root, [data-theme="dp"] {
      --primary: #1D4ED8; /* DP Blue */
      --primary-light: #3b82f6;
      --primary-dark: #1e3a8a;
      --secondary: #E11D48; /* DP Red */
      --background: #f8fafc;
      --foreground: #0f172a;
      --card: #ffffff;
      --card-hover: #f1f5f9;
      --border: #e2e8f0;
      --muted: #f1f5f9;
      --muted-foreground: #64748b;
      color-scheme: light;
    }

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
    // Initialization script to set theme immediately and prevent flash
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
  <!-- Theme Switcher -->
  <div id="theme-switcher-container" style="position: fixed; bottom: 24px; right: 24px; z-index: 9999;">
    <button id="theme-toggle-btn" class="flex items-center justify-center w-14 h-14 rounded-full bg-card shadow-lg border border-border text-foreground hover:scale-105 active:scale-95 transition-all" aria-label="Toggle Theme">
      <i id="theme-icon" data-lucide="monitor" class="w-6 h-6 text-primary"></i>
      <span id="dp-badge" class="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">DP</span>
    </button>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('theme-toggle-btn');
      const icon = document.getElementById('theme-icon');
      const badge = document.getElementById('dp-badge');
      
      const updateUI = (theme) => {
        if(theme === 'dp') {
          icon.setAttribute('data-lucide', 'monitor');
          icon.classList.add('text-primary');
          badge.style.display = 'block';
        } else if (theme === 'light') {
          icon.setAttribute('data-lucide', 'sun');
          icon.classList.remove('text-primary');
          badge.style.display = 'none';
        } else {
          icon.setAttribute('data-lucide', 'moon');
          icon.classList.remove('text-primary');
          badge.style.display = 'none';
        }
        if(window.lucide) window.lucide.createIcons();
      };

      let currentTheme = localStorage.getItem('theme-mode') || 'dp';
      updateUI(currentTheme);

      btn.addEventListener('click', () => {
        if(currentTheme === 'dp') currentTheme = 'light';
        else if(currentTheme === 'light') currentTheme = 'dark';
        else currentTheme = 'dp';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme-mode', currentTheme);
        updateUI(currentTheme);
      });
    });
  </script>
`;

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

    // Replace class names
    for (const [key, value] of Object.entries(replacements)) {
      const escapedKey = key.replace(/\\[/g, '\\\\[').replace(/\\]/g, '\\\\]');
      const regex = new RegExp(`(?<=[\\s"'\\\`])(${escapedKey})(?=[\\s"'\\\`])`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, value);
        hasChanges = true;
      }
    }

    // Inject Theme Switcher before </body>
    if (content.includes('</body>') && !content.includes('theme-switcher-container')) {
      content = content.replace('</body>', switcherHtml + '\\n</body>');
      hasChanges = true;
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
