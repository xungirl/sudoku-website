import { useState } from 'react'
import { Link } from 'react-router-dom'

const GAMES = [
  { title: 'Classic Challenge',  author: 'Alex Thompson', mode: 'normal' },
  { title: "Beginner's Delight", author: 'Sarah Chen',    mode: 'easy' },
  { title: 'Mind Bender',        author: 'Mike Johnson',  mode: 'normal' },
  { title: 'Morning Warm-up',    author: 'Emily Davis',   mode: 'easy' },
  { title: "Expert's Paradise",  author: 'David Kim',     mode: 'normal' },
  { title: 'Quick Puzzle',       author: 'Lisa Wang',     mode: 'easy' },
]

export default function Selection() {
  const [filter, setFilter] = useState('all')

  const visible = GAMES.filter(g =>
    filter === 'all' || g.mode === filter
  )

  return (
    <div className="container">
      <div className="page-title">
        <h1>Select a Game</h1>
        <p>Choose a difficulty and start a new puzzle.</p>
      </div>

      <div className="diff-tabs">
        {['all', 'easy', 'normal'].map(f => (
          <button
            key={f}
            className={`diff-tab ${filter === f ? 'diff-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Games' : f === 'easy' ? 'Easy (6×6)' : 'Normal (9×9)'}
          </button>
        ))}
      </div>

      <div className="game-list">
        {visible.map((g, i) => (
          <Link key={i} to={`/games/${g.mode}`} className="game-item">
            <div className="game-info">
              <h3>{g.title}</h3>
              <p>by {g.author}</p>
            </div>
            <div className="game-meta">
              <span className={`diff-badge diff-badge--${g.mode}`}>
                {g.mode === 'easy' ? 'Easy' : 'Normal'}
              </span>
              <span className="btn btn-primary">Play</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="footer">
        <p>© 2025 Sudoku Master</p>
      </footer>
    </div>
  )
}
