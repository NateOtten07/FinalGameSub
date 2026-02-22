export const beats = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

export function decideWinner(player, cpu) {
  if (player === cpu) return "tie";
  return beats[player] === cpu ? "player" : "cpu";
}

// CPU move selection with optional "hard" bias towards beating lastPlayerMove.
export function getCpuMove({
  difficulty = "normal",
  lastPlayerMove = null,
} = {}) {
  const moves = ["rock", "paper", "scissors"];
  if (difficulty !== "hard" || !lastPlayerMove) {
    return moves[Math.floor(Math.random() * 3)];
  }
  const counter = { rock: "paper", paper: "scissors", scissors: "rock" }[
    lastPlayerMove
  ];
  // 60% choose counter, 40% random
  return Math.random() < 0.6 ? counter : moves[Math.floor(Math.random() * 3)];
}

// Helper for score math
export function nextScore(prev, outcome) {
  const s = { ...prev };
  if (outcome === "player") s.player++;
  else if (outcome === "cpu") s.cpu++;
  else s.ties++;
  return s;
}
