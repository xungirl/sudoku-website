import { Link } from 'react-router-dom';

const DEMO_NUMS = [5, 3, 7, 6, 9, 1, 4, 8, 2];

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1 className="hero-title">Sudoku Master</h1>
        <p className="hero-subtitle">
          Challenge your mind with the classic number puzzle. Create games, compete on leaderboards, and track your wins.
        </p>

        <div className="hero-grid">
          {DEMO_NUMS.map((n, i) => (
            <div key={i} className="hero-cell">{n}</div>
          ))}
        </div>

        <div className="cta-buttons">
          <Link to="/games" className="btn btn-primary">Start Playing</Link>
          <Link to="/rules" className="btn btn-secondary">Learn the Rules</Link>
        </div>
      </section>

      <section className="features">
        <div className="card feature-card">
          <div className="feature-icon">🎮</div>
          <h3>Two Difficulty Modes</h3>
          <p>Easy 6×6 grids for beginners, or Classic 9×9 puzzles for the real challenge.</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Compete on Leaderboards</h3>
          <p>Every completed puzzle counts as a win. Climb the high-score rankings!</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Shareable Puzzles</h3>
          <p>Every game has a unique name and can be shared with friends to solve the same puzzle.</p>
        </div>
      </section>
    </main>
  );
}
