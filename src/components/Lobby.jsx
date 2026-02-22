import { capitalize } from "../utils/string_formatting";
import { avatars } from "../logic/avatars";

export const LobbyView = ({
  onGameStart,
  onSettingsSave,
  name,
  setName,
  avatar,
  setAvatar,
  difficulty,
  setDifficulty,
  darkMode,
  setDarkMode,
}) => {
  const isGameStartEnabled = avatar !== undefined && name !== ``;

  const handleGameStart = () => {
    onGameStart();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSettingsSave();
  };

  return (
    <section aria-labelledby="settings-heading" className="card">
      <h2 id="settings-heading">Player Settings</h2>

      <div role="status" aria-live="polite" data-testid="greeting">
        {name ? `Hello ${name}` : null}
      </div>
      <div data-testid="errors" aria-live="polite" className="errors" aria-atomic="true"></div>

      <form id="settings-form" onSubmit={handleFormSubmit} noValidate>
        <div className="field">
          <label htmlFor="player-name">Player Name</label>
          <input
            id="player-name"
            name="player-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="15"
          />
        </div>

        <fieldset>
          <legend>Choose an avatar</legend>
          <div className="avatar-options">
            {avatars.map((a) => {
              return (
                <label key={a.key} className="avatar-option">
                  <input
                    type="radio"
                    name="avatar"
                    value={a.key}
                    checked={a.key === avatar}
                    onChange={() => setAvatar(a.key)}
                  />
                  <img src={a.image} alt="{avatar.key}" />
                  <span>{capitalize(a.key)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">easy</option>
            <option value="normal">normal</option>
            <option value="hard">hard</option>
          </select>
        </div>

        <div className="field checkbox">
          <label>
            <input
              id="theme-toggle"
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((darkMode) => !darkMode)}
            />{" "}
            Dark Theme
          </label>
        </div>

        <button id="save-settings" type="submit">
          Save Settings
        </button>
      </form>

      <div className="game-actions">
        <button id="start-game" type="button" onClick={handleGameStart} disabled={!isGameStartEnabled}>
          Start Game
        </button>
      </div>
    </section>
  );
};
