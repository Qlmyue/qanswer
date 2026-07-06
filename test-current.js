const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[ERROR]:', msg.text());
    }
  });

  try {
    console.log('1. 登录...');
    await page.goto('http://localhost:5177/login', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);

    await page.fill('input[placeholder*="用户名"]', 'testuser2');
    await page.fill('input[placeholder*="密码"]', 'Test123456');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    console.log('   URL:', page.url());

    // 仪表盘
    console.log('\n2. 仪表盘...');
    await page.screenshot({ path: 'D:/fupan/screenshots/current-01-dashboard.png', fullPage: true });

    // 点击复盘点管理
    console.log('\n3. 点击复盘点管理...');
    await page.click('text=复盘点管理');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'D:/fupan/screenshots/current-02-review.png', fullPage: true });

    // 点击新建复盘点
    console.log('\n4. 点击新建复盘点...');
    await page.click('text=新建复盘点');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'D:/fupan/screenshots/current-03-create.png', fullPage: true });

    // 填写问题
    console.log('\n5. 填写问题...');
    await page.fill('textarea', '什么是RAG？');
    await page.screenshot({ path: 'D:/fupan/screenshots/current-04-filled.png', fullPage: true });

    // 点击手动输入
    console.log('\n6. 选择手动输入...');
    const manualBtn = await page.$('text=手动输入答案');
    if (manualBtn) {
      await manualBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'D:/fupan/screenshots/current-05-manual.png', fullPage: true });
    }

    console.log('\n✅ 测试完成');

  } catch (error) {
    console.error('错误:', error.message);
    await page.screenshot({ path: 'D:/fupan/screenshots/current-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
