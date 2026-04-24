import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getBorderStyle(r, c, size, boxR, boxC) {
  const style = {};
  if ((c + 1) % boxC === 0 && c + 1 < size) style.borderRight = '3px solid var(--grid-border-thick)';
  if ((r + 1) % boxR === 0 && r + 1 < size) style.borderBottom = '3px solid var(--grid-border-thick)';
  return style;
}

export default function Game() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const storageKey = `sudoku_${gameId}_${user || 'guest'}`;

  useEffect(() => {
    async function load() {
      try {
        const [gameData, scores] = await Promise.all([
          api.getGame(gameId),
          api.getGameHighScore(gameId),
        ]);
        setGame(gameData);

        const alreadyCompleted = user && scores.some((s) => s.username === user);
        if (alreadyCompleted) {
          setCompleted(true);
          setBoard(gameData.solution.map((r) => [...r]));
        } else {
          const saved = localStorage.getItem(storageKey);
          setBoard(saved ? JSON.parse(saved) : gameData.puzzle.map((r) => [...r]));
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [gameId, user, storageKey]);

  const inputNumber = useCallback(
    (row, col, num) => {
      if (!game || !board || completed) return;
      if (game.puzzle[row][col] !== 0) return;
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = num;
      setBoard(newBoard);
      setErrors(new Set());
      if (user) localStorage.setItem(storageKey, JSON.stringify(newBoard));
    },
    [game, board, completed, user, storageKey]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCell || !game || completed) return;
      const size = game.solution.length;
      const { row, col } = selectedCell;
      const num = parseInt(e.key);

      if (!isNaN(num) && num >= 1 && num <= size) {
        inputNumber(row, col, num);
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        inputNumber(row, col, 0);
      } else if (e.key === 'ArrowUp') {
        setSelectedCell((p) => ({ ...p, row: Math.max(0, p.row - 1) }));
      } else if (e.key === 'ArrowDown') {
        setSelectedCell((p) => ({ ...p, row: Math.min(size - 1, p.row + 1) }));
      } else if (e.key === 'ArrowLeft') {
        setSelectedCell((p) => ({ ...p, col: Math.max(0, p.col - 1) }));
      } else if (e.key === 'ArrowRight') {
        setSelectedCell((p) => ({ ...p, col: Math.min(size - 1, p.col + 1) }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, game, completed, inputNumber]);

  const checkSolution = async () => {
    const size = game.solution.length;
    const newErrors = new Set();

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (board[r][c] === 0 || board[r][c] !== game.solution[r][c]) {
          newErrors.add(`${r}-${c}`);
        }
      }
    }

    if (newErrors.size === 0) {
      setCompleted(true);
      setErrors(new Set());
      localStorage.removeItem(storageKey);
      if (user) {
        try { await api.postHighScore(gameId); } catch {}
      }
    } else {
      setErrors(newErrors);
    }
  };

  const resetGame = () => {
    if (!window.confirm('Reset the game? Your progress will be lost.')) return;
    const fresh = game.puzzle.map((r) => [...r]);
    setBoard(fresh);
    setErrors(new Set());
    setSelectedCell(null);
    localStorage.removeItem(storageKey);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this game? This cannot be undone and will remove all high scores for it.')) return;
    try {
      await api.deleteGame(gameId);
      navigate('/games');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <main className="container"><div className="loading-state">Loading…</div></main>;
  if (notFound) return (
    <main className="container">
      <div className="empty-state">
        <h2>Game not found</h2>
        <Link to="/games" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Games</Link>
      </div>
    </main>
  );

  const size = game.solution.length;
  const isEasy = size === 6;
  const boxR = isEasy ? 2 : 3;
  const boxC = 3;

  return (
    <main className="container">
      <div className="page-title">
        <h1>
          {game.name}
          <span className={`badge badge-${game.difficulty.toLowerCase()}`} style={{ marginLeft: '0.75rem', verticalAlign: 'middle' }}>
            {game.difficulty}
          </span>
        </h1>
        <p>Created by {game.createdBy} · {formatDate(game.createdAt)}</p>
      </div>

      {completed && (
        <div className="completion-banner">
          🎉 Puzzle Completed!{!user && <span> · <Link to="/register">Register</Link> to save your wins</span>}
        </div>
      )}

      {!user && !completed && (
        <div className="info-notice">
          <Link to="/login">Log in</Link> to save progress and earn high scores.
        </div>
      )}

      <div className="sudoku-container">
        <div
          className="sudoku-grid"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            width: isEasy ? 'min(90vw, 360px)' : 'min(90vw, 450px)',
            height: isEasy ? 'min(90vw, 360px)' : 'min(90vw, 450px)',
          }}
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const isPrefilled = game.puzzle[r][c] !== 0;
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isError = errors.has(`${r}-${c}`);
              const isSameNum = selectedCell && val !== 0 && val === board[selectedCell.row]?.[selectedCell.col];

              let cellClass = 'sudoku-cell';
              if (isPrefilled) cellClass += ' prefilled';
              if (isSelected) cellClass += ' selected';
              if (isError && !isPrefilled) cellClass += ' error';
              if (isSameNum && !isSelected) cellClass += ' highlight-same';

              const borderStyle = getBorderStyle(r, c, size, boxR, boxC);

              return (
                <div
                  key={`${r}-${c}`}
                  className={cellClass}
                  style={borderStyle}
                  onClick={() => {
                    if (completed || isPrefilled) return;
                    if (!user) return;
                    setSelectedCell({ row: r, col: c });
                  }}
                >
                  {val !== 0 ? val : ''}
                </div>
              );
            })
          )}
        </div>

        {!completed && user && (
          <div className={`number-pad ${isEasy ? 'pad-6' : 'pad-9'}`}>
            {Array.from({ length: size }, (_, i) => (
              <button
                key={i + 1}
                className="number-btn"
                onClick={() => selectedCell && inputNumber(selectedCell.row, selectedCell.col, i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="number-btn erase-btn"
              onClick={() => selectedCell && inputNumber(selectedCell.row, selectedCell.col, 0)}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="game-actions">
        {!completed && user && (
          <button className="btn btn-primary" onClick={checkSolution}>
            Check Solution
          </button>
        )}
        {user && (
          <button className="btn btn-secondary" onClick={resetGame}>
            Reset
          </button>
        )}
        {user === game.createdBy && (
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Game
          </button>
        )}
        <Link to="/games" className="btn btn-ghost">← All Games</Link>
      </div>
    </main>
  );
}
