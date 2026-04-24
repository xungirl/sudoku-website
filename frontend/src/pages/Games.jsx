import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function Games() {
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getGames()
      .then(setGames)
      .catch(console.error)
      .finally(() => setLoadingGames(false));
  }, []);

  const createGame = async (difficulty) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCreating(true);
    try {
      const game = await api.createGame(difficulty);
      navigate(`/game/${game._id}`);
    } catch (err) {
      alert(err.message);
      setCreating(false);
    }
  };

  return (
    <main className="container">
      <div className="page-title">
        <h1>Game Selection</h1>
        <p>Create a new puzzle or continue an existing one</p>
      </div>

      <div className="create-section">
        {!user && (
          <p className="login-notice">
            <Link to="/login">Log in</Link> to create games and save your scores.
          </p>
        )}
        <div className="create-buttons">
          <button
            className="btn btn-primary btn-large"
            onClick={() => createGame('NORMAL')}
            disabled={creating}
          >
            {creating ? 'Creating…' : 'Create Normal Game'}
            <span className="btn-sub">9×9 Classic</span>
          </button>
          <button
            className="btn btn-secondary btn-large"
            onClick={() => createGame('EASY')}
            disabled={creating}
          >
            {creating ? 'Creating…' : 'Create Easy Game'}
            <span className="btn-sub">6×6 Beginner</span>
          </button>
        </div>
      </div>

      <div className="section-divider">
        <span>Or choose an existing game</span>
      </div>

      {loadingGames ? (
        <div className="loading-state">Loading games…</div>
      ) : games.length === 0 ? (
        <div className="empty-state">
          <p>No games yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="game-list">
          {games.map((game) => (
            <div
              key={game._id}
              className="game-item"
              onClick={() => navigate(`/game/${game._id}`)}
            >
              <div className="game-info">
                <h3>{game.name}</h3>
                <p>By {game.createdBy} · {formatDate(game.createdAt)}</p>
              </div>
              <div className="game-meta">
                <span className={`badge badge-${game.difficulty.toLowerCase()}`}>
                  {game.difficulty}
                </span>
                <span className="play-arrow">Play →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
