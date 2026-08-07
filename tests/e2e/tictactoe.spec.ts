import { expect, test } from '@playwright/test';

const settings = {
  name: 'Test Player',
  avatar: 'wizard',
  difficulty: 'normal',
  darkMode: false,
};

test.describe('Tic Tac Toe', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('lobby');
    await page.evaluate((settings) => localStorage.setItem('game.settings', JSON.stringify(settings)), settings);
    await page.goto('game/tic-tac-toe');
  });

  test('loads initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /tic-tac-toe/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /square 1/i })).toBeVisible();
    await expect(page.getByText(/next player: x/i)).toBeVisible();
  });

  test('ability to interact with the game components', async ({ page }) => {
    await page.getByRole('button', { name: /square 1/i }).click();
    await page.getByRole('button', { name: /square 2/i }).click();
    await expect(page.getByRole('button', { name: /square 1: x/i })).toBeVisible();
  });

  test('ability to reset a game to return to initial state', async ({ page }) => {
    await page.getByRole('button', { name: /square 1/i }).click();
    await page.getByRole('button', { name: /square 2/i }).click();
    await page.getByRole('button', { name: /reset game/i }).click();
    await expect(page.getByRole('button', { name: /square 1/i })).toBeVisible();
    await expect(page.getByText(/next player: x/i)).toBeVisible();
  });
});
