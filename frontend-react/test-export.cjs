const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('1. 访问登录页面...');
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');

    console.log('2. 输入登录信息...');
    await page.fill('input[id="username"]', 'imoon');
    await page.fill('input[id="password"]', '1qazXSW@');

    console.log('3. 点击登录...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    console.log('4. 跳转到导出页面...');
    await page.goto('http://localhost:5174/export');
    await page.waitForTimeout(2000);

    console.log('5. 截图当前页面...');
    await page.screenshot({ path: 'export-page.png', fullPage: true });

    // Check if review points are loaded
    const pageContent = await page.textContent('body');
    console.log('页面内容前300字符:', pageContent?.substring(0, 300));

    // Try clicking export all button
    const exportAllBtn = await page.$('button:has-text("导出全部")');
    if (exportAllBtn) {
      console.log('6. 找到导出全部按钮，点击...');
      // Set up download handler
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
        exportAllBtn.click()
      ]);

      if (download) {
        console.log('✅ 下载成功:', download.suggestedFilename());
      } else {
        console.log('⚠️ 没有触发下载事件');
      }
    } else {
      console.log('❌ 找不到导出全部按钮');
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'export-result.png', fullPage: true });

  } catch (error) {
    console.error('测试出错:', error.message);
    await page.screenshot({ path: 'export-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
