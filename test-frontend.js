const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 捕获所有控制台输出
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type()}]:`, msg.text());
  });

  page.on('pageerror', error => {
    console.log('[PAGE ERROR]:', error.message);
  });

  try {
    // 先登录
    console.log('1. 登录...');
    await page.goto('http://localhost:5177/login', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);

    await page.fill('input[placeholder*="用户名"]', 'testuser2');
    await page.fill('input[placeholder*="密码"]', 'Test123456');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);

    console.log('   当前URL:', page.url());

    // 检查仪表盘
    console.log('\n2. 仪表盘...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'D:/fupan/screenshots/dashboard-debug.png', fullPage: true });

    const bodyText = await page.textContent('body');
    console.log('   页面内容长度:', bodyText.length);
    console.log('   包含"欢迎":', bodyText.includes('欢迎'));
    console.log('   包含"统计":', bodyText.includes('统计'));

    // 测试复盘点页面
    console.log('\n3. 复盘点...');
    await page.goto('http://localhost:5177/review', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'D:/fupan/screenshots/review-debug.png', fullPage: true });

    console.log('\n✅ 完成');

  } catch (error) {
    console.error('错误:', error.message);
    await page.screenshot({ path: 'D:/fupan/screenshots/error-debug.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
