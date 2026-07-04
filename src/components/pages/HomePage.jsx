import { Link } from "react-router-dom";

export function HomePage() {
    const games = [
        {key: "rps", name: "Rock Paper Scissors", description: "A simple game of Rock Paper Scissors."},
        {key: "tic-tac-toe", name: "Tic Tac Toe", description: "A simple game of Tic Tac Toe."},
    ];

    return (
        <section>
            <h2>Available Games</h2>
            <p>Choose a game to play</p>

            <ul style={{ textAlign: "left"}}>
                {games.map((game) => (
                    <li key={game.key}>
                        <Link to={`/game/${game.key}`}>{game.name}</Link>
                        <p>{game.description}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}