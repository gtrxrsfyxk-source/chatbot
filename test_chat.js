const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('#chat-input', { timeout: 10000 });
    
    console.log('Page loaded successfully');
    
    // Test quick action button click
    console.log('Testing quick action button...');
    await page.click('.quick-action');
    
    // Wait a bit to see console logs
    await page.waitForTimeout(3000);
    
    // Test manual typing
    console.log('Testing manual typing...');
    await page.fill('#chat-input', 'בדיקה');
    await page.click('#send-button');
    
    // Wait for response
    await page.waitForTimeout(5000);
    
    console.log('Test completed');
  } catch (error) {
    console.error('Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
