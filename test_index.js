const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('./public/app/index.html', 'utf-8');

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (err) => {
  console.error("JSDOM Error:", err);
});
virtualConsole.on("jsdomError", (err) => {
  console.error("JSDOM Internal Error:", err);
});
virtualConsole.on("log", (log) => {
  console.log("JSDOM Log:", log);
});

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  url: "file:///C:/Projects/dp/public/app/index.html",
  virtualConsole
});

setTimeout(() => {
  console.log("Root innerHTML length:", dom.window.document.getElementById('root').innerHTML.length);
  process.exit(0);
}, 2000);
