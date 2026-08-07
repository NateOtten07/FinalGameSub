import { Link, useSearchParams } from "react-router-dom";

export function HomePage() {
  const [params, setParams] = useSearchParams();
  const search = (params.get("search") || "").toLowerCase();

  const games = [
    { key: "rps", name: "Rock Paper Scissors", description: "A simple game of Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic Tac Toe", description: "A simple game of Tic Tac Toe" },
    { key: "wordle", name: "Wordle", description: "A simple game of Wordle" },
    { key: "type-test", name: "Type Test", description: "A typing speed test" },
  ];

  const filteredGames = games.filter((game) => 
    (!search || game.name.toLowerCase().includes(search))
  );

  const renderGameItem = (game) => (
    <li key={game.key}>
      <Link to={`/game/${game.key}`}>{game.name}</Link>
      <p>{game.description}</p>
    </li>
  );

  return (

    <section>
    <section>
      <h2>Available Games</h2>
      <p>Choose a game to play</p>

      <input
        id="game-search"
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === "") {
            setParams({});
          } else {
            setParams({ search: value });
          }
        }}
      />

      <ul style={{ textAlign: "left" }}>
        {filteredGames.map((game) => renderGameItem(game))}
      </ul>

    </section>

      </section>
  );
}