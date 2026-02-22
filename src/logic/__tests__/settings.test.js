import { vi, describe, beforeEach, test, expect } from "vitest";
import { saveSettings, loadSettings, getHighscores, setHighscores } from "../settings";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveSettings", () => {
    test("saves settings to localStorage", () => {
      const settings = { theme: "dark", sound: true };
      saveSettings(settings);

      expect(localStorageMock.setItem).toHaveBeenCalledWith("game.settings", JSON.stringify(settings));
    });
  });

  describe("loadSettings", () => {
    test("returns parsed settings when data exists", () => {
      const settings = { theme: "dark", sound: true };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(settings));

      const result = loadSettings();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("game.settings");
      expect(result).toEqual(settings);
    });

    test("returns null when no data exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = loadSettings();

      expect(result).toBeNull();
    });

    test("returns null when data is invalid JSON", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const result = loadSettings();

      expect(result).toBeNull();
    });
  });

  describe("getHighscores", () => {
    test("returns parsed highscores when data exists", () => {
      const highscores = [{ name: "Player1", score: 100 }];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(highscores));

      const result = getHighscores();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("game.highscores");
      expect(result).toEqual(highscores);
    });

    test("returns empty array when no data exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getHighscores();

      expect(result).toEqual([]);
    });

    test("returns empty array when data is invalid JSON", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const result = getHighscores();

      expect(result).toEqual([]);
    });
  });

  describe("setHighscores", () => {
    test("saves highscores to localStorage", () => {
      const highscores = [{ name: "Player1", score: 100 }];
      setHighscores(highscores);

      expect(localStorageMock.setItem).toHaveBeenCalledWith("game.highscores", JSON.stringify(highscores));
    });
  });
});
