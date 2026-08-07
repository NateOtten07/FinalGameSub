const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log('goto lobby');
  await page.goto('http://localhost:4173/FinalGameSub/lobby');
  console.log('set localStorage');
  await page.evaluate(() => localStorage.setItem('game.settings', JSON.stringify({ name: 'Test Player', avatar: 'wizard', difficulty: 'normal', darkMode: false })));
  console.log('goto tic tac toe');
  await page.goto('http://localhost:4173/FinalGameSub/game/tic-tac-toe');
  console.log('url', page.url());
  console.log('headings', await page.locator('h2').allTextContents());
  console.log('square 1 visible', await page.locator('button[aria-label^="Square 1"]').isVisible());
  console.log('status', await page.locator('.status').textContent());
  await browser.close();
})();
