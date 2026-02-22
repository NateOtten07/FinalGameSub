import { test, expect } from '@playwright/test';

test.describe('Home Page and Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('search params filter games on home page', async ({ page }) => {
    await page.goto('/');
    
    // Type in search box
    await page.fill('#game-search', 'rock');
    await expect(page).toHaveURL('/?search=rock');
    
    // Should show only RPS game
    await expect(page.locator('li')).toHaveCount(1);
    await expect(page.locator('li a[href="/game/rps"]')).toContainText('Rock Paper Scissors');
    
    // Clear search
    await page.fill('#game-search', '');
    await expect(page).toHaveURL('/');
    await expect(page.locator('li')).toHaveCount(2);
  });
});
