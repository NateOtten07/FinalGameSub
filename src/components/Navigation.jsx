import { NavLink, useNavigate } from "react-router-dom";
import { loadSettings } from "../logic/settings";

export function Navigation() {
  const navigate = useNavigate();
  const settings = loadSettings();

  const handleLogout = () => {
    localStorage.removeItem("game.settings");
    navigate("/");
  };

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      {` | `}
      <NavLink to="/lobby">Lobby</NavLink>
      {` | `}
      <NavLink to="/game/rps">Rock Paper Scissors</NavLink>
      {` | `}
      <NavLink to="/game/tic-tac-toe">Tic-Tac-Toe</NavLink>

      {settings && settings.name && (
        <div>
          <span>Hello, {settings.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}