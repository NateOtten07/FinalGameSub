import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsProvider, useSettings } from "../../src/context/SettingsContext";
import { loadSettings, saveSettings } from "../../src/logic/settings";

// Mock the settings module
vi.mock("../../src/logic/settings", () => ({
  loadSettings: vi.fn(),
  saveSettings: vi.fn(),
}));

// Test component that uses the context
function TestComponent() {
  const { settings, saveSettings, clearSettings } = useSettings();

  return (
    <div>
      <div data-testid="settings">{settings ? JSON.stringify(settings) : "null"}</div>
      <button
        onClick={() => saveSettings({ name: "Test", avatar: "wizard", difficulty: "normal", darkMode: false })}
        data-testid="save-button"
      >
        Save Settings
      </button>
      <button onClick={clearSettings} data-testid="clear-button">
        Clear Settings
      </button>
    </div>
  );
}

// Component that should throw error when used outside provider
function ComponentOutsideProvider() {
  useSettings();
  return <div>Should not render</div>;
}

describe("SettingsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it("provides initial settings from localStorage", () => {
    const mockSettings = { name: "TestUser", avatar: "knight", difficulty: "hard", darkMode: true };
    loadSettings.mockReturnValue(mockSettings);

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId("settings")).toHaveTextContent(JSON.stringify(mockSettings));
  });

  it("provides null when no settings in localStorage", () => {
    loadSettings.mockReturnValue(null);

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId("settings")).toHaveTextContent("null");
  });

  it("updates settings when saveSettings is called", () => {
    loadSettings.mockReturnValue(null);

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Initially null
    expect(screen.getByTestId("settings")).toHaveTextContent("null");

    // Click save button
    fireEvent.click(screen.getByTestId("save-button"));

    // Should now have settings
    expect(screen.getByTestId("settings")).toHaveTextContent(
      JSON.stringify({ name: "Test", avatar: "wizard", difficulty: "normal", darkMode: false })
    );

    // Should call saveSettings with the new settings
    expect(saveSettings).toHaveBeenCalledWith({
      name: "Test",
      avatar: "wizard",
      difficulty: "normal",
      darkMode: false,
    });
  });

  it("clears settings when clearSettings is called", () => {
    const mockSettings = { name: "TestUser", avatar: "knight", difficulty: "hard", darkMode: true };
    loadSettings.mockReturnValue(mockSettings);

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Initially has settings
    expect(screen.getByTestId("settings")).toHaveTextContent(JSON.stringify(mockSettings));

    // Click clear button
    fireEvent.click(screen.getByTestId("clear-button"));

    // Should now be null
    expect(screen.getByTestId("settings")).toHaveTextContent("null");
  });

  it("throws error when useSettings is used outside provider", () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<ComponentOutsideProvider />);
    }).toThrow("useSettings must be used within SettingsProvider");

    consoleSpy.mockRestore();
  });

  it("initializes state directly from localStorage without useEffect", () => {
    const mockSettings = { name: "DirectLoad", avatar: "wizard", difficulty: "easy", darkMode: false };
    loadSettings.mockReturnValue(mockSettings);

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Should call loadSettings during initialization
    expect(loadSettings).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("settings")).toHaveTextContent(JSON.stringify(mockSettings));
  });

  it("handles localStorage errors gracefully", () => {
    // Mock localStorage to throw an error
    const originalLocalStorage = global.localStorage;
    global.localStorage = {
      getItem: vi.fn(() => {
        throw new Error("localStorage error");
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    loadSettings.mockImplementation(() => {
      try {
        return JSON.parse(localStorage.getItem("game.settings"));
      } catch {
        return null;
      }
    });

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    // Should handle error gracefully and return null
    expect(screen.getByTestId("settings")).toHaveTextContent("null");

    // Restore localStorage
    global.localStorage = originalLocalStorage;
  });
});
