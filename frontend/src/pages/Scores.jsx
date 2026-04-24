import { useState, useEffect } from 'react';
import * as api from '../api';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Scores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHighScores()
      .then(setScores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <div className="page-title">
        <h1>High Scores</h1>
        <p>Top puzzle solvers — ranked by total wins</p>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Loading scores…</div>
        ) : scores.length === 0 ? (
          <div className="empty-state">
            <p>No wins recorded yet. Complete some puzzles to appear here!</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Wins</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={s.username} className={i === 0 ? 'row-gold' : i === 1 ? 'row-silver' : i === 2 ? 'row-bronze' : ''}>
                  <td className="rank-cell">
                    {MEDALS[i] || <span className="rank-num">#{i + 1}</span>}
                  </td>
                  <td className="username-cell">{s.username}</td>
                  <td className="wins-cell">{s.wins} {s.wins === 1 ? 'win' : 'wins'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
