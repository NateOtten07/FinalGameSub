import { test, expect } from '@playwright/test';

test.describe('App Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete user flow from settings to game play', async ({ page }) => {
    // Start at lobby
    await page.goto('/lobby');
    
    // Fill settings
    await page.fill('#player-name', 'IntegrationTest');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.selectOption('#difficulty', 'normal');
    await page.check('#theme-toggle');
    await page.click('#save-settings');
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
    
    // Navigate to RPS game
    await page.goto('/game/rps');
    
    // Play a round
    await page.click('[data-move="rock"]');
    await expect(page.locator('#history li').first()).toContainText(/Player\(rock\) vs CPU\(/);
    
    // Navigate to Tic-Tac-Toe
    await page.goto('/game/tic-tac-toe');
    await expect(page.locator('h2')).toContainText('Tic-Tac-Toe');
    
    // Play Tic-Tac-Toe
    await page.locator('.square').first().click();
    await expect(page.locator('.square').first()).toHaveText('X');
  });
});
