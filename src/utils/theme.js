import { loadSettings } from "../logic/settings";

export function applySavedTheme() {
  const settings = loadSettings();
  const hasDark = settings && settings.darkMode;
  const rootElement = document.getElementById("root");

  if (hasDark) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("theme-dark");
    document.body.classList.add("theme-dark");
    if (rootElement) {
      rootElement.classList.add("theme-dark");
    }
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("theme-dark");
    document.body.classList.remove("theme-dark");
    if (rootElement) {
      rootElement.classList.remove("theme-dark");
    }
  }
}
