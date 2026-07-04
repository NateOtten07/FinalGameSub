import { GameHeader } from "./GameHeader";
import { HistorySection } from "./HistorySection";
import { beats, decideWinner, getCpuMove, nextScore } from "../../logic/game";
import { MoveButton } from "./MoveButton";
import { ScoreBoard } from "./ScoreBoard";
import { useState } from "react";

export const GameSection = ({ difficulty }) => {
  const [score, setScore] = useState({
    player: 0,
    cpu: 0,
    ties: 0,
  });
  const [history, setHistory] = useState([]);
  const moves = Object.keys(beats);

  const playRound = (move) => {
    const cpuMove = getCpuMove();
    const outcome = decideWinner(move, cpuMove);
    const msg = outcome === "player" ? "You win!" : outcome === "cpu" ? "CPU wins!" : "Tie.";
    setScore((score) => nextScore(score, outcome));
    setHistory((currentHistory) => [{ player: move, cpu: cpuMove, msg }, ...currentHistory]);
  };

  const onResetGame = () => {
    setScore({
      player: 0,
      cpu: 0,
      ties: 0,
    });
    setHistory([]);
  };

  return (
    <section aria-labelledby="game-heading" className="card">
      <GameHeader difficulty={difficulty} />
      <ScoreBoard score={score} />
      <div className="buttons">
        {moves.map((m) => (
          <MoveButton key={m} label={m} onClick={() => playRound(m)} />
        ))}
      </div>
      <HistorySection history={history} />
      <div className="buttons">
        <button id="reset-game" type="button" onClick={() => onResetGame()}>
          Reset Game
        </button>
      </div>
    </section>
  );
};
