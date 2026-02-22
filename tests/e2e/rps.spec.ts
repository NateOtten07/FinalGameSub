import { test, expect } from '@playwright/test';

test.describe('Rock Paper Scissors Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('playing rounds updates scoreboard and history', async ({ page }) => {
    // Prepare valid settings on settings page
    await page.goto('/lobby');
    await page.fill('#player-name', 'Kai');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');

    // Navigate directly to game
    await page.goto('/game/rps');

    const rockBtn = page.locator('[data-move="rock"]');
    await rockBtn.click();
    await expect(page.locator('#history li').first()).toContainText(/Player\(rock\) vs CPU\(/);

    // After several rounds, totals should sum
    for (let i = 0; i < 4; i++) await page.locator('[data-move="paper"]').click();

    const p = parseInt(await page.locator('#score-player').innerText(), 10);
    const c = parseInt(await page.locator('#score-cpu').innerText(), 10);
    const t = parseInt(await page.locator('#score-ties').innerText(), 10);
    expect(p + c + t).toBeGreaterThanOrEqual(5);
  });

  test('reset game clears scores and history but keeps settings', async ({ page }) => {
    await page.goto('/lobby');
    await page.fill('#player-name', 'Mia');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');

    // Navigate directly to game
    await page.goto('/game/rps');

    await page.click('[data-move="scissors"]');
    await page.click('#reset-game');

    await expect(page.locator('#score-player')).toHaveText('0');
    await expect(page.locator('#history li')).toHaveCount(0);

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('game.settings')!));
    expect(saved.name).toBe('Mia');
  });

  test('RPS game functionality works with router', async ({ page }) => {
    // Setup and navigate to RPS
    await page.goto('/lobby');
    await page.fill('#player-name', 'RPSPlayer');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');
    await page.goto('/game/rps');
    
    // Play a round
    await page.click('[data-move="rock"]');
    await expect(page.locator('#history li').first()).toContainText(/Player\(rock\) vs CPU\(/);
    
    // Check scores update
    const playerScore = await page.locator('#score-player').textContent();
    const cpuScore = await page.locator('#score-cpu').textContent();
    const ties = await page.locator('#score-ties').textContent();
    
    expect(parseInt(playerScore || '0') + parseInt(cpuScore || '0') + parseInt(ties || '0')).toBeGreaterThanOrEqual(1);
  });
});
