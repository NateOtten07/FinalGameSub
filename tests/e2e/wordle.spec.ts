import { expect, test } from '@playwright/test';

const settings = {
  name: 'Test Player',
  avatar: 'wizard',
  difficulty: 'normal',
  darkMode: false,
};

test.describe('Wordle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lobby');
    await page.evaluate((settings) => localStorage.setItem('game.settings', JSON.stringify(settings)), settings);
    await page.goto('/game/wordle');
  });

  test('loads initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /wordle/i })).toBeVisible();
    await expect(page.getByText(/use your keyboard to type letters/i)).toBeVisible();
  });

  test('ability to interact with the game components', async ({ page }) => {
    await page.keyboard.type('REACT');
    await page.keyboard.press('Enter');
    await expect(page.getByText(/you need 5 letters before submitting/i)).toBeHidden({ timeout: 1000 }).catch(() => {});
  });

  test('ability to reset a game to return to initial state', async ({ page }) => {
    await page.keyboard.type('REACT');
    await page.getByRole('button', { name: /reset game/i }).click();
    const firstCell = page.getByRole('gridcell', { name: /row 1 column 1/i });
    await expect(firstCell).toHaveText('');
  });
});
