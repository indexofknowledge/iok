const puppeteer = require('puppeteer');

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
  const browser = await puppeteer.launch({ userDataDir: '/dev/null' });
  const page = await browser.newPage();
  await page.goto(process.env.SCRAPE_APP);
  try {
    await sleep(5000)
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: process.cwd(),
    });
    await page.waitForSelector('#downloadButton')
    await page.click('#downloadButton')
    await sleep(5000)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  await browser.close();
})();