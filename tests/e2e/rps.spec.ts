import { expect, test } from '@playwright/test';

const settings = {
  name: 'Test Player',
  avatar: 'wizard',
  difficulty: 'normal',
  darkMode: false,
};

test.describe('Rock Paper Scissors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('lobby');
    await page.evaluate((settings) => localStorage.setItem('game.settings', JSON.stringify(settings)), settings);
    await page.goto('game/rps');
  });

  test('loads initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /rock paper scissors/i })).toBeVisible();
    await expect(page.getByText(/player:/i)).toBeVisible();
    await expect(page.getByText(/cpu:/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /reset game/i })).toBeVisible();
  });

  test('ability to interact with the game components', async ({ page }) => {
    await page.getByRole('button', { name: /rock/i }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText(/player\(|cpu\(/i)).toBeVisible();
  });

  test('ability to reset a game to return to initial state', async ({ page }) => {
    await page.getByRole('button', { name: /rock/i }).click();
    await page.getByRole('button', { name: /reset game/i }).click();
    await expect(page.getByText(/player: 0/i)).toBeVisible();
    await expect(page.getByText(/cpu: 0/i)).toBeVisible();
    await expect(page.getByText(/ties: 0/i)).toBeVisible();
  });
});

