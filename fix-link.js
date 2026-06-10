const fs = require('fs');
const file = 'c:/Projects/dp/public/app/index.html';
let txt = fs.readFileSync(file, 'utf8');

const scriptToAdd = `
    <script>
      window.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.includes('/webpages/brouchure')) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = '../webpages/brochure.html';
        }
      }, true);
    </script>
  </body>`;

if (!txt.includes("window.location.href = '../webpages/brochure.html'")) {
    txt = txt.replace('</body>', scriptToAdd);
    fs.writeFileSync(file, txt, 'utf8');
    console.log("Fix injected.");
} else {
    console.log("Fix already present.");
}
