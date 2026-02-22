export function HighScoresSection() {
  return (
    <section aria-labelledby="highscores-heading" className="card">
      <h2 id="highscores-heading">High Scores</h2>
      <ul id="highscores"></ul>
      <button id="clear-highscores" type="button">
        Clear High Scores
      </button>
    </section>
  );
}
