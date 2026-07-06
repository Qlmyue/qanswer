const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Listen for console messages
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.type(), msg.text());
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    console.log('Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });

    console.log('Page title:', await page.title());
    console.log('Page URL:', page.url());

    // Check if there are any elements on the page
    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    console.log('Body content length:', bodyContent.length);
    console.log('Body content preview:', bodyContent.substring(0, 500));

    // Take a screenshot
    await page.screenshot({ path: 'page-screenshot.png', fullPage: true });
    console.log('Screenshot saved to page-screenshot.png');

    // Wait a bit for any async loading
    await page.waitForTimeout(3000);

    // Check again
    const bodyContentAfter = await page.evaluate(() => document.body.innerHTML);
    console.log('Body content after wait length:', bodyContentAfter.length);
    console.log('Body content after wait preview:', bodyContentAfter.substring(0, 500));

    // Take another screenshot
    await page.screenshot({ path: 'page-screenshot-after.png', fullPage: true });
    console.log('Screenshot after wait saved to page-screenshot-after.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
