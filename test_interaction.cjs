const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console logs and errors
  page.on('console', msg => {
    console.log(`BROWSER [${msg.type().toUpperCase()}]:`, msg.text());
  });
  
  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });
  
  try {
    console.log('Loading page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    console.log('Waiting for chat interface...');
    await page.waitForSelector('.quick-action', { timeout: 10000 });
    await page.waitForSelector('#chat-input', { timeout: 5000 });
    
    console.log('✅ Page loaded with chat interface');
    
    // Test 1: Click quick action button
    console.log('\n🧪 TEST 1: Quick Action Button');
    await page.click('.quick-action:first-child');
    console.log('✅ Clicked first quick action button');
    
    // Wait for any response
    await page.waitForTimeout(3000);
    
    // Test 2: Manual message input
    console.log('\n🧪 TEST 2: Manual Message Input');
    await page.fill('#chat-input', 'בדיקת הודעה ידנית');
    console.log('✅ Filled chat input');
    
    await page.click('#send-button');
    console.log('✅ Clicked send button');
    
    // Wait for response
    await page.waitForTimeout(5000);
    
    // Check if messages were added
    const messagesCount = await page.locator('.message').count();
    console.log(`📊 Total messages in chat: ${messagesCount}`);
    
    console.log('\n✅ Tests completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
