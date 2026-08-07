import { useEffect, useState } from 'react';
import { loadSettings } from '../logic/settings';

const API_URL = 'https://game-room-api.fly.dev/api/rooms';
const initialBoard = Array(9).fill(null);

function Square({ value, onSquareClick, index }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      aria-label={`Square ${index + 1}${value ? `: ${value}` : ''}`}
      type="button"
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

async function createRoom() {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      initialState: {
        board: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
        currentPlayer: 'X',
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Could not create game room.');
  }

  return response.json();
}

async function fetchRoom(roomId) {
  const response = await fetch(`${API_URL}/${roomId}`);
  if (!response.ok) {
    throw new Error('Room not found.');
  }

  return response.json();
}

async function updateRoom(roomId, board, currentPlayer) {
  const response = await fetch(`${API_URL}/${roomId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameState: {
        board: [
          board.slice(0, 3),
          board.slice(3, 6),
          board.slice(6, 9),
        ],
        currentPlayer,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Could not update room state.');
  }

  return response.json();
}

export function TicTacToePage() {
  const settings = loadSettings();
  const playerName = settings?.name;
  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [roomId, setRoomId] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('Create or join a room to begin.');
  const [error, setError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const winner = calculateWinner(board);
  const isBoardFull = board.every(Boolean);

  useEffect(() => {
    if (winner) {
      setStatusMessage(`Winner: ${winner}`);
    } else if (isBoardFull) {
      setStatusMessage('Draw. Reset the board to play again.');
    } else if (roomId) {
      setStatusMessage(`Next player: ${currentPlayer}`);
    } else {
      setStatusMessage(`Next player: ${currentPlayer} — create or join a room to sync the game.`);
    }
  }, [winner, isBoardFull, currentPlayer, roomId]);

  const handleCreateRoom = async () => {
    setError('');
    setIsSyncing(true);
    try {
      const data = await createRoom();
      const createdRoomId = data.roomId || data.id || '';
      setRoomId(createdRoomId);
      setRoomInput(createdRoomId);
      setBoard(initialBoard);
      setCurrentPlayer('X');
      setStatusMessage(`Room ${createdRoomId} created. Next player: X`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomInput.trim()) {
      setError('Enter a room code before joining.');
      return;
    }

    setError('');
    setIsSyncing(true);
    try {
      const data = await fetchRoom(roomInput.trim());
      const boardState = data.gameState.board.flat();
      setBoard(boardState);
      setCurrentPlayer(data.gameState.currentPlayer || 'X');
      setRoomId(data.id || roomInput.trim());
      setStatusMessage(`Joined room ${data.id || roomInput.trim()}. Next player: ${data.gameState.currentPlayer || 'X'}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncBoard = async (nextBoard, nextPlayer) => {
    if (!roomId) {
      return;
    }

    setError('');
    setIsSyncing(true);
    try {
      await updateRoom(roomId, nextBoard, nextPlayer);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSquareClick = async (index) => {
    if (winner || board[index] || isSyncing) {
      return;
    }

    const nextBoard = board.slice();
    nextBoard[index] = currentPlayer;
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

    setBoard(nextBoard);
    setCurrentPlayer(nextPlayer);

    if (roomId) {
      await syncBoard(nextBoard, nextPlayer);
    }
  };

  const handleReset = async () => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setError('');

    if (roomId) {
      await syncBoard(initialBoard, 'X');
    }
  };

  return (
    <div className="game">
      <h2>Tic-Tac-Toe</h2>
      {playerName ? <div role="status">Welcome {playerName}!</div> : null}
      <section className="card">
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="room-id" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Room code
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              id="room-id"
              type="text"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Enter room code"
              style={{ flex: '1 1 220px', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            />
            <button type="button" onClick={handleJoinRoom} disabled={isSyncing}>
              Join Room
            </button>
            <button type="button" onClick={handleCreateRoom} disabled={isSyncing}>
              Create Room
            </button>
          </div>
        </div>

        {roomId ? (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Room:</strong> {roomId}
          </div>
        ) : null}

        {error ? (
          <div style={{ color: 'var(--color-error)', marginBottom: '1rem' }}>{error}</div>
        ) : null}

        <div className="status" style={{ marginBottom: '1rem' }}>
          {statusMessage} {isSyncing ? 'Syncing...' : ''}
        </div>

        <div className="game-board">
          <div className="board-row">
            <Square value={board[0]} onSquareClick={() => handleSquareClick(0)} index={0} />
            <Square value={board[1]} onSquareClick={() => handleSquareClick(1)} index={1} />
            <Square value={board[2]} onSquareClick={() => handleSquareClick(2)} index={2} />
          </div>
          <div className="board-row">
            <Square value={board[3]} onSquareClick={() => handleSquareClick(3)} index={3} />
            <Square value={board[4]} onSquareClick={() => handleSquareClick(4)} index={4} />
            <Square value={board[5]} onSquareClick={() => handleSquareClick(5)} index={5} />
          </div>
          <div className="board-row">
            <Square value={board[6]} onSquareClick={() => handleSquareClick(6)} index={6} />
            <Square value={board[7]} onSquareClick={() => handleSquareClick(7)} index={7} />
            <Square value={board[8]} onSquareClick={() => handleSquareClick(8)} index={8} />
          </div>
        </div>

        <div className="game-info" style={{ marginTop: '1rem' }}>
          <button type="button" onClick={handleReset} disabled={isSyncing}>
            Reset Game
          </button>
        </div>
      </section>
    </div>
  );
}
