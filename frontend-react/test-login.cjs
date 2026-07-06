const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('1. 访问登录页面...');
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');

    console.log('2. 等待登录表单加载...');
    await page.waitForSelector('input[id="username"]', { timeout: 10000 });

    console.log('3. 输入用户名...');
    await page.fill('input[id="username"]', 'imoon');

    console.log('4. 输入密码...');
    await page.fill('input[id="password"]', '1qazXSW@');

    console.log('5. 点击登录按钮...');
    await page.click('button[type="submit"]');

    console.log('6. 等待页面跳转...');
    await page.waitForTimeout(3000);

    console.log('7. 检查当前URL...');
    const currentUrl = page.url();
    console.log('当前URL:', currentUrl);

    console.log('8. 检查页面内容...');
    const pageContent = await page.textContent('body');
    console.log('页面内容前200字符:', pageContent?.substring(0, 200));

    // 截图保存
    await page.screenshot({ path: 'login-test-result.png', fullPage: true });
    console.log('截图已保存到 login-test-result.png');

    if (currentUrl.includes('dashboard')) {
      console.log('✅ 登录成功！已跳转到仪表盘');
    } else if (currentUrl.includes('login')) {
      console.log('❌ 登录失败，仍在登录页面');
      // 检查是否有错误信息
      const errorElement = await page.$('.text-red-600, [class*="error"]');
      if (errorElement) {
        const errorText = await errorElement.textContent();
        console.log('错误信息:', errorText);
      }
    } else {
      console.log('⚠️ 跳转到其他页面:', currentUrl);
    }

  } catch (error) {
    console.error('测试过程中出错:', error.message);
    await page.screenshot({ path: 'login-test-error.png', fullPage: true });
    console.log('错误截图已保存到 login-test-error.png');
  } finally {
    await browser.close();
  }
})();
