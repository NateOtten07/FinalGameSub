import { test, expect } from '@playwright/test';

test.describe('Tic-Tac-Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('tic-tac-toe game works', async ({ page }) => {
    // Go to lobby and save settings
    await page.goto('/lobby');
    await page.fill('#player-name', 'TicTacPlayer');
    await page.click('label.avatar-option:has(input[value="knight"])');
    await page.click('#save-settings');
    
    // Navigate to Tic-Tac-Toe
    await page.goto('/game/tic-tac-toe');
    await expect(page.locator('h2')).toContainText('Tic-Tac-Toe');
    
    // Play a game
    await page.locator('.square').first().click(); // First square
    await expect(page.locator('.square').first()).toHaveText('X');
    
    // Check that status shows next player
    await expect(page.locator('.status')).toContainText('Next player: O');
  });
});
