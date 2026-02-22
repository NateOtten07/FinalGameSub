import { test, expect } from '@playwright/test';

test.describe('Lobby - Settings and Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('settings form saves and theme applies', async ({ page }) => {
    await page.goto('/lobby');

    // Fill form
    await page.fill('#player-name', 'Alex');
    // pick first avatar (wizard)
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.selectOption('#difficulty', 'hard');
    await page.check('#theme-toggle'); // dark

    await page.click('#save-settings');

    // After saving, user should be redirected to home page
    await expect(page).toHaveURL('/');
    await expect(page.locator('main').first()).toHaveClass(/theme-dark/);

    // LocalStorage structure
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('game.settings')!));
    expect(saved).toMatchObject({
      name: 'Alex',
      avatar: expect.any(String),
      difficulty: 'hard',
      darkMode: true,
    });
  });

  test('form prepopulates from localStorage on reload', async ({ page }) => {
    await page.goto('/lobby');
    await page.fill('#player-name', 'Sam');
    await page.click('label.avatar-option:has(input[value="knight"])');
    await page.selectOption('#difficulty', 'normal');
    await page.uncheck('#theme-toggle');
    await page.click('#save-settings');

    // Navigate back to lobby to check settings
    await page.goto('/lobby');

    await expect(page.locator('#player-name')).toHaveValue('Sam');
    await expect(page.locator('[data-testid="greeting"]')).toContainText('Sam');
  });

  test('settings persist across page reloads', async ({ page }) => {
    // Save settings
    await page.goto('/lobby');
    await page.fill('#player-name', 'PersistentUser');
    await page.click('label.avatar-option:has(input[value="ninja"])');
    await page.selectOption('#difficulty', 'hard');
    await page.check('#theme-toggle');
    await page.click('#save-settings');
    
    // Navigate back to lobby to check settings
    await page.goto('/lobby');
    
    // Settings should be preserved
    await expect(page.locator('#player-name')).toHaveValue('PersistentUser');
    await expect(page.locator('input[value="ninja"]')).toBeChecked();
    await expect(page.locator('#difficulty')).toHaveValue('hard');
    await expect(page.locator('#theme-toggle')).toBeChecked();
    
    // Theme should be applied
    await expect(page.locator('main')).toHaveClass(/theme-dark/);
  });

  test('lobby saves settings and redirects back to protected route', async ({ page }) => {
    // Navigate to RPS game (should redirect to lobby)
    await page.goto('/game/rps');
    await expect(page).toHaveURL('/lobby');
    
    // Fill and save settings
    await page.fill('#player-name', 'TestPlayer');
    await page.click('label.avatar-option:has(input[value="wizard"])');
    await page.selectOption('#difficulty', 'normal');
    await page.click('#save-settings');
    
    // Should redirect back to RPS game
    await expect(page).toHaveURL('/game/rps');
    await expect(page.locator('[data-testid="greeting"]')).toContainText('TestPlayer');
  });
});
