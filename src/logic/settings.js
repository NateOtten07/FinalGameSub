// Handle localStorage for settings/highscores

export function saveSettings(settings) {
  localStorage.setItem('game.settings', JSON.stringify(settings));
}

export function loadSettings() {
  const raw = localStorage.getItem('game.settings');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function getHighscores() {
  try { return JSON.parse(localStorage.getItem('game.highscores') || '[]'); } catch { return []; }
}

export function setHighscores(list) {
  localStorage.setItem('game.highscores', JSON.stringify(list));
}
