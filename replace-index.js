const fs = require('fs');
const file = 'c:/Projects/dp/public/app/index.html';
let txt = fs.readFileSync(file, 'utf8');

const target = `{id:"products",title:"Products & Services",description:"Luxury Custom Printing & Industrial Packaging Showcase",icon:qM,path:"/products"}`;
const replacement = `{id:"brouchure",title:"Brouchure",description:"Explore our packaging solutions",icon:qM,path:"/webpages/brouchure"}`;

if (txt.includes("Products & Services")) {
    console.log("Found 'Products & Services'!");
    txt = txt.replace(target, replacement);
    fs.writeFileSync(file, txt, 'utf8');
    console.log("Replaced in index.html");
} else {
    console.log("NOT FOUND in index.html");
}
