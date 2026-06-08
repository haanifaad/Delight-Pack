const fs = require('fs');

const filesToUpdate = [
  'C:/Projects/dp/public/index.html',
  'C:/Projects/dp/public/app/index.html'
];

for (const file of filesToUpdate) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Fix brand colors: old purplish blue -> correct logo blue
  content = content.replace(/#123bb5/g, '#2563EB');
  content = content.replace(/#1D4ED8/gi, '#2563EB');
  
  // Fix brand colors: old rose red -> correct logo red
  content = content.replace(/#d81b21/g, '#DC2626');
  content = content.replace(/#E11D48/gi, '#DC2626');

  // Replace container classes to be permanently dark/premium
  content = content.replace(
    /class="flex items-center gap-1 p-1 bg-card\/80 backdrop-blur-2xl border border-border rounded-full shadow-2xl"/g,
    'class="flex items-center gap-1 p-1 bg-[#050505]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl"'
  );

  // Replace the JS logic for the active/inactive pill buttons
  content = content.replace(
    /btn\.classList\.add\('bg-background', 'text-foreground', 'shadow-sm'\);\s*btn\.classList\.remove\('text-muted-foreground'\);\s*\} else \{\s*btn\.classList\.remove\('bg-background', 'text-foreground', 'shadow-sm'\);\s*btn\.classList\.add\('text-muted-foreground'\);\s*\}/g,
    "btn.classList.add('bg-white/10', 'text-white', 'shadow-sm');\n          btn.classList.remove('text-white/40');\n        } else {\n          btn.classList.remove('bg-white/10', 'text-white', 'shadow-sm');\n          btn.classList.add('text-white/40');\n        }"
  );

  // Replace the HTML button classes so they default to the new dark theme
  content = content.replace(/text-muted-foreground hover:text-foreground/g, 'text-white/40 hover:text-white');

  fs.writeFileSync(file, content);
  console.log(`Updated theme switcher in ${file}`);
}
