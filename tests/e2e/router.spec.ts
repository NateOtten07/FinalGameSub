import { test, expect } from '@playwright/test';

test.describe('Router Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('complete routing flow with authentication', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to the Games Lobby');
    
    // Try to access protected route (should redirect to lobby)
    await page.goto('/game/rps');
    await expect(page).toHaveURL('/lobby');
    
    // Fill settings and save
    await page.fill('#player-name', 'RouterTest');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');
    
    // Should be redirected back to RPS game
    await expect(page).toHaveURL('/game/rps');
    
    // Test navigation between routes
    await page.goto('/');
    await expect(page.locator('nav a[href="/"].active').first()).toBeVisible();
    
    await page.goto('/lobby');
    await expect(page.locator('nav a[href="/lobby"].active')).toBeVisible();
  });
});
