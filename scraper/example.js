const puppeteer = require('puppeteer');
const fs = require('fs')

sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

strip_html_tags = (str) => {
   if ((str===null) || (str===''))
       return false;
  else
   str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/?loaduser=rustielin.id.blockstack&guest=true&json=true');

  await page.waitForSelector('#jsonData', { timeout: 5000 })
  await page.screenshot({path: 'example.png'});
  const html = await page.content()
  var dat = strip_html_tags(html)
  fs.writeFileSync('graph.json', dat)

  await browser.close();
})();