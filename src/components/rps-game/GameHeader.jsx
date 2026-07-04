export function GameHeader({ difficulty }) {
  return (
    <>
      <h2 id="game-heading">Game</h2>
      <div className="difficulty-info">
        <span>
          Difficulty: <strong id="current-difficulty">{difficulty}</strong>
        </span>
      </div>
    </>
  );
}
