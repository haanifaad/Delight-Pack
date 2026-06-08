const fs = require('fs');

const files = [
  'C:/Projects/dp/public/index.html',
  'C:/Projects/dp/public/webpages/dp/webpages/index.html'
];

const blobHtml = `
  <div class="pointer-blobs" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: -1; overflow: hidden;">
    <div class="blob-blue" style="position: absolute; left: var(--mouse-x, 50vw); top: var(--mouse-y, 50vh); width: 1400px; height: 1400px; background: radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 60%); transform: translate(-80%, -50%); transition: left 0.15s ease-out, top 0.15s ease-out, opacity 0.5s; opacity: 0; filter: blur(80px);"></div>
    <div class="blob-red" style="position: absolute; left: var(--mouse-x, 50vw); top: var(--mouse-y, 50vh); width: 1400px; height: 1400px; background: radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 60%); transform: translate(-20%, -50%); transition: left 0.4s ease-out, top 0.4s ease-out, opacity 0.5s; opacity: 0; filter: blur(80px);"></div>
  </div>
`;

const blobScript = `
  <script>
    document.addEventListener('mousemove', (e) => {
      const isDp = document.documentElement.getAttribute('data-theme') === 'dp';
      const blue = document.querySelector('.blob-blue');
      const red = document.querySelector('.blob-red');
      
      if (blue && red) {
        if (isDp) {
          blue.style.opacity = '1';
          red.style.opacity = '1';
          blue.style.setProperty('--mouse-x', e.clientX + 'px');
          blue.style.setProperty('--mouse-y', e.clientY + 'px');
          red.style.setProperty('--mouse-x', e.clientX + 'px');
          red.style.setProperty('--mouse-y', e.clientY + 'px');
        } else {
          blue.style.opacity = '0';
          red.style.opacity = '0';
        }
      }
    });

    // Also update on theme change in case mouse doesn't move
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const isDp = document.documentElement.getAttribute('data-theme') === 'dp';
          const blue = document.querySelector('.blob-blue');
          const red = document.querySelector('.blob-red');
          if (blue && red) {
            blue.style.opacity = isDp ? '1' : '0';
            red.style.opacity = isDp ? '1' : '0';
          }
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  </script>
`;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove old injections if they exist
    content = content.replace(/<div class="pointer-blobs".*?<\/div>\s*<\/div>/s, '');
    content = content.replace(/<script>\s*document\.addEventListener\('mousemove'[\s\S]*?<\/script>/, '');

    // Inject before </body>
    if (content.includes('</body>')) {
      content = content.replace('</body>', `${blobHtml}\n${blobScript}\n</body>`);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Injected blobs into ${file}`);
    }
  }
});
