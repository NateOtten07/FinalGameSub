import { useState } from "react";
import "./App.css";
import { GameView } from "./components/Game";
import { LobbyView } from "./components/Lobby";
import { loadSettings, saveSettings } from "./logic/settings";

export function App() {
  const initialSettings = loadSettings() || {
    name: ``,
    difficulty: `normal`,
    avatar: undefined,
    darkMode: false,
  };
  const [view, setView] = useState("settings");
  const [name, setName] = useState(initialSettings.name);
  const [avatar, setAvatar] = useState(initialSettings.avatar);
  const [difficulty, setDifficulty] = useState(initialSettings.difficulty);
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);

  const currentTheme = darkMode ? `theme-dark` : `theme-light`;

  const onGameStart = () => {
    console.log(`onGameStart`);
    setView("game");
  };

  const onSettingsSave = () => {
    saveSettings({
      name,
      avatar,
      difficulty,
      darkMode,
    });
  };

  return (
    <main className={currentTheme}>
      <h1>Games Lobby</h1>
      <p>Hello, React 👋</p>
      {view === `settings` && (
        <LobbyView
          onGameStart={onGameStart}
          onSettingsSave={onSettingsSave}
          name={name}
          setName={setName}
          avatar={avatar}
          setAvatar={setAvatar}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      {view === `game` && <GameView playerName={name} playerAvatar={avatar} difficulty={difficulty} />}
    </main>
  );
}
