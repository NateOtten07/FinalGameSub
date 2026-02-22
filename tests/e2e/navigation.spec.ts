import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('home page displays and links work', async ({ page }) => {
    await page.goto('/');
    
    // Check that home page elements are present
    await expect(page.locator('h1')).toContainText('Welcome to the Games Lobby');
    await expect(page.locator('h2')).toContainText('Available Games');
    
    // Check that game links exist
    await expect(page.locator('a[href="/game/rps"]').first()).toBeVisible();
    await expect(page.locator('a[href="/game/tic-tac-toe"]').first()).toBeVisible();
    await expect(page.locator('a[href="/lobby"]').first()).toBeVisible();
    
    // Check navigation bar
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav a[href="/"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="/lobby"]')).toBeVisible();
    await expect(page.locator('nav a[href="/game/rps"]')).toBeVisible();
    await expect(page.locator('nav a[href="/game/tic-tac-toe"]')).toBeVisible();
  });

  test('protected routes redirect to lobby when not authenticated', async ({ page }) => {
    // Try to access RPS game without settings
    await page.goto('/game/rps');
    await expect(page).toHaveURL('/lobby');
    
    // Try to access Tic-Tac-Toe game without settings
    await page.goto('/game/tic-tac-toe');
    await expect(page).toHaveURL('/lobby');
  });

  test('navigation bar shows active route', async ({ page }) => {
    // Check home page
    await page.goto('/');
    await expect(page.locator('nav a[href="/"].active').first()).toBeVisible();
    
    // Check lobby page
    await page.goto('/lobby');
    await expect(page.locator('nav a[href="/lobby"].active')).toBeVisible();
  });

  test('logout clears settings and redirects', async ({ page }) => {
    // First login
    await page.goto('/lobby');
    await page.fill('#player-name', 'LoggedInUser');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.click('#save-settings');
    
    // Should be on home page
    await expect(page).toHaveURL('/');
    
    // Click logout
    await page.click('button:has-text("Logout")');
    
    // Should be redirected to home
    await expect(page).toHaveURL('/');
    
    // Try to access protected route
    await page.goto('/game/rps');
    await expect(page).toHaveURL('/lobby');
  });
});
