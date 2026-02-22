import { loadSettings } from "../logic/settings";

export function applySavedTheme() {
  const settings = loadSettings();
  if (settings && settings.darkMode) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.classList.add("theme-dark");
    // Also apply to main element - use setTimeout to ensure it runs after render
    setTimeout(() => {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.classList.add("theme-dark");
      }
    }, 0);
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.body.classList.remove("theme-dark");
    // Remove from main element - use setTimeout to ensure it runs after render
    setTimeout(() => {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.classList.remove("theme-dark");
      }
    }, 0);
  }
}
