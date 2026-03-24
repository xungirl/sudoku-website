import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="container">
      <section className="hero">
        <h1 className="hero-title">Sudoku Master</h1>
        <p className="hero-subtitle">
          Challenge your mind with the classic number puzzle.<br />
          Easy 6×6 for beginners, Normal 9×9 for experts.
        </p>

        <div className="hero-grid" aria-hidden="true">
          {[5,3,7,6,9,1,4,8,2].map((n, i) => (
            <div key={i} className="hero-cell">{n}</div>
          ))}
        </div>

        <div className="cta-buttons">
          <Link to="/games" className="btn btn-primary">🎮 Start Playing</Link>
          <Link to="/rules" className="btn btn-secondary">📖 Learn Rules</Link>
        </div>
      </section>

      <div className="features-grid">
        <div className="card feature-card">
          <div className="feature-icon">🎮</div>
          <h3>Multiple Modes</h3>
          <p>Easy 6×6 grids for beginners or the classic 9×9 challenge for experts.</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon">⏱️</div>
          <h3>Timed Challenges</h3>
          <p>A live timer tracks your solve speed — can you beat your best time?</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon">💡</div>
          <h3>Smart Hints</h3>
          <p>Stuck? Use the Hint button to reveal a cell that has only one valid answer.</p>
        </div>
        <div className="card feature-card">
          <div className="feature-icon">↩</div>
          <h3>Undo & Reset</h3>
          <p>Made a mistake? Undo your last move or reset the board to its original state.</p>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Sudoku Master — Built with React &amp; Vite</p>
      </footer>
    </div>
  )
}
