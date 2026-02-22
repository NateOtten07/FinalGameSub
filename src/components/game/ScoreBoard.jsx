export const ScoreBoard = ({ score }) => {
  return (
    <div className="score-row">
      <span>
        Player: <strong id="score-player">{score.player}</strong>
      </span>
      <span>
        CPU: <strong id="score-cpu">{score.cpu}</strong>
      </span>
      <span>
        Ties: <strong id="score-ties">{score.ties}</strong>
      </span>
    </div>
  );
};
