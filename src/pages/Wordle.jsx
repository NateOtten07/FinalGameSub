import { useEffect, useState } from "react";

const ROWS = 6;
const COLS = 5;

const makeEmptyGrid = () => Array.from({ length: ROWS }, () => Array(COLS).fill(""));

function getDailyWord() {
  const today = new Date();
  const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const hash = Array.from(dayKey).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seeds = ["react", "games", "plant", "cloud", "shine", "brave", "music", "house", "robot", "grace"];
  return seeds[hash % seeds.length].toUpperCase();
}

async function isWordValid(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    return response.ok;
  } catch {
    return false;
  }
}

function getColor(letter, index, guess, target) {
  if (guess[index] === target[index]) return "#6aaa64";

  const targetLetterCount = target.split("").filter((item) => item === letter).length;
  const guessLetterCount = guess
    .split("")
    .slice(0, index)
    .filter((item) => item === letter).length;

  if (targetLetterCount > guessLetterCount) {
    return "#c9b458";
  }

  return "#787c7e";
}

export default function Wordle() {
  const [targetWord, setTargetWord] = useState("");
  const [grid, setGrid] = useState(makeEmptyGrid());
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [message, setMessage] = useState("Loading words...");
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(makeEmptyGrid());

  useEffect(() => {
    async function loadTargetWord() {
      const dailyWord = getDailyWord();

      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${dailyWord.toLowerCase()}`);
        if (!response.ok) {
          setMessage("Could not load a target word from the dictionary API.");
          return;
        }

        const data = await response.json();
        const word = data?.[0]?.word?.toUpperCase();
        if (word && word.length === COLS) {
          setTargetWord(word);
          setMessage("Enter a 5-letter guess.");
          return;
        }

        setMessage("Could not load a target word from the dictionary API.");
      } catch (error) {
        console.error(error);
        setMessage("Could not load words from the dictionary API.");
      }
    }

    loadTargetWord();
  }, []);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (gameOver) return;

      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        if (col < COLS) {
          const nextGrid = grid.map((rowLetters) => [...rowLetters]);
          nextGrid[row][col] = key;
          setGrid(nextGrid);
          setCol((prev) => prev + 1);
        }
      } else if (event.key === "Backspace") {
        if (col > 0) {
          const nextGrid = grid.map((rowLetters) => [...rowLetters]);
          const newCol = col - 1;
          nextGrid[row][newCol] = "";
          setGrid(nextGrid);
          setCol(newCol);
        }
      } else if (event.key === "Enter") {
        const guess = grid[row].join("");
        if (guess.length < COLS) {
          setMessage("You need 5 letters before submitting.");
          return;
        }

        if (!targetWord) {
          setMessage("The game is still loading.");
          return;
        }

        const isValid = await isWordValid(guess);
        if (!isValid) {
          setMessage("That word is not in the list.");
          return;
        }

        const nextFeedback = feedback.map((rowLetters) => [...rowLetters]);
        guess.split("").forEach((letter, index) => {
          nextFeedback[row][index] = getColor(letter, index, guess, targetWord);
        });
        setFeedback(nextFeedback);

        if (guess === targetWord) {
          setMessage(`You win! The word was ${targetWord}.`);
          setGameOver(true);
          return;
        }

        if (row === ROWS - 1) {
          setMessage(`Game over! The word was ${targetWord}.`);
          setGameOver(true);
          return;
        }

        setMessage("Try another guess.");
        setRow((prev) => prev + 1);
        setCol(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [col, feedback, gameOver, grid, row, targetWord]);

  return (
    <section style={{ maxWidth: "420px", margin: "2rem auto" }}>
      <h2>Wordle</h2>
      <p>{message}</p>
      <div
        id="wordle-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 48px)",
          gap: "8px",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        {grid.flatMap((rowLetters, rowIndex) =>
          rowLetters.map((letter, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const color = feedback[rowIndex][colIndex];
            return (
              <div
                key={key}
                style={{
                  border: "2px solid #ccc",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: color || "#fff",
                  color: color ? "#fff" : "#000",
                }}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
      <p style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
        Use your keyboard to type letters, press Enter to submit, and Backspace to edit.
      </p>
    </section>
  );
}