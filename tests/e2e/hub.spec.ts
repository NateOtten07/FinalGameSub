import { expect, test } from '@playwright/test';

const settings = {
  name: 'Test Player',
  avatar: 'wizard',
  difficulty: 'normal',
  darkMode: false,
};

async function savePlayerSettings(page) {
  await page.goto('/lobby');
  await page.getByRole('textbox', { name: /player name/i }).fill(settings.name);
  await page.getByLabel('Dark Theme').check({ force: true });
  await Promise.all([
    page.waitForURL('/'),
    page.getByRole('button', { name: /save settings/i }).click(),
  ]);
}

test.describe('Hub', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('loads the landing page', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 2, name: /available games/i })).toBeVisible();
  });

  test('lists available games', async ({ page }) => {
    const gameList = page.getByRole('list');
    await expect(gameList.getByRole('link', { name: /rock paper scissors/i })).toBeVisible();
    await expect(gameList.getByRole('link', { name: /tic tac toe/i })).toBeVisible();
    await expect(gameList.getByRole('link', { name: /wordle/i })).toBeVisible();
    await expect(gameList.getByRole('link', { name: /type test/i })).toBeVisible();
  });

  test('captures a player name', async ({ page }) => {
    await page.goto('/lobby');
    await page.getByRole('textbox', { name: /player name/i }).fill(settings.name);
    await page.getByRole('button', { name: /save settings/i }).click();

    const savedSettings = await page.evaluate(() => JSON.parse(localStorage.getItem('game.settings') || '{}'));
    expect(savedSettings.name).toBe(settings.name);
  });

  test('navigates from hub into all game pages and back', async ({ page }) => {
    await savePlayerSettings(page);

    const gameList = page.getByRole('list');
    const pages = [
      { link: /rock paper scissors/i, heading: /rock paper scissors/i, url: '/game/rps' },
      { link: /tic tac toe/i, heading: /tic-tac-toe/i, url: '/game/tic-tac-toe' },
      { link: /wordle/i, heading: /wordle/i, url: '/game/wordle' },
      { link: /type test/i, heading: /how fast do you type\?/i, url: '/game/type-test' },
    ];

    for (const game of pages) {
      await Promise.all([
        page.waitForURL(game.url),
        gameList.getByRole('link', { name: game.link }).click(),
      ]);
      await expect(page.getByRole('heading', { name: game.heading })).toBeVisible();
      await Promise.all([
        page.waitForURL('/'),
        page.getByRole('link', { name: /home/i }).click(),
      ]);
    }
  });

  test('player name is displayed on all game pages', async ({ page }) => {
    await savePlayerSettings(page);

    const gameChecks = [
      { path: '/game/rps', label: /welcome test player/i },
      { path: '/game/tic-tac-toe', label: /welcome test player/i },
      { path: '/game/wordle', label: /welcome test player/i },
      { path: '/game/type-test', label: /welcome test player/i },
    ];

    for (const game of gameChecks) {
      await page.goto(game.path);
      await expect(page.getByText(game.label)).toBeVisible();
    }
  });
});
