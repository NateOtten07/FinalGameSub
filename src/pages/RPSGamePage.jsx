import { GameSection } from "../components/rps-game/GameSection";
import { HighScoresSection } from "../components/rps-game/HighScoresSection";
import { PlayerInfoCard } from "../components/rps-game/PlayerInfoCard";
import { loadSettings } from '../logic/settings';

export function RPSGamePage() {
  const settings = loadSettings();
  
  const playerName = settings?.name || 'Player';
  const playerAvatar = settings?.avatar;
  const difficulty = settings?.difficulty || 'normal';

  const handleBackToSettings = () => {
    console.log(`going back to the settings view`);
  };

  return (
    <main>
      <header>
        <h2>Rock Paper Scissors</h2>
        <nav>
          <a onClick={handleBackToSettings} className="nav-link">
            ← Back to Settings
          </a>
        </nav>
      </header>
      <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar} />
      <GameSection difficulty={difficulty} />
      <HighScoresSection />
    </main>
  );
}