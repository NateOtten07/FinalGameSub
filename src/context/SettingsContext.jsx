import { createContext, useContext, useState } from "react";
import { loadSettings, saveSettings as saveToStorage } from "../logic/settings";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  // ✅ Initialize state directly from localStorage (no useEffect needed)
  const [settings, setSettings] = useState(() => loadSettings());

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    saveToStorage(newSettings);
  };

  const clearSettings = () => {
    setSettings(null);
    localStorage.removeItem("game.settings");
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, clearSettings }}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
