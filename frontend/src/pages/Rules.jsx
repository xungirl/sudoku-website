export default function Rules() {
  return (
    <main className="container">
      <div className="page-title">
        <h1>How to Play</h1>
        <p>Master the art of Sudoku</p>
      </div>

      <div className="rules-layout">
        <div className="card">
          <h2>The Rules</h2>
          <div className="rule-list">
            <div className="rule-item">
              <span className="rule-num">1</span>
              <div>
                <h3>Fill the Grid</h3>
                <p>
                  Fill every empty cell with a number from 1 to N, where N is the board size
                  (6 for Easy, 9 for Normal).
                </p>
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-num">2</span>
              <div>
                <h3>Unique Rows</h3>
                <p>Each row must contain every number from 1 to N exactly once.</p>
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-num">3</span>
              <div>
                <h3>Unique Columns</h3>
                <p>Each column must contain every number from 1 to N exactly once.</p>
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-num">4</span>
              <div>
                <h3>Unique Subgrids</h3>
                <p>
                  Each highlighted subgrid (3×3 in Normal mode, 2×3 in Easy mode) must contain
                  every number exactly once.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Difficulty Modes</h2>
          <div className="diff-cards">
            <div className="diff-card diff-easy">
              <span className="badge badge-easy">EASY</span>
              <h3>Easy Mode — 6×6</h3>
              <p>
                A 6×6 grid using numbers 1–6. Subgrids are 2 rows × 3 columns. Perfect for beginners
                or a quick puzzle session.
              </p>
            </div>
            <div className="diff-card diff-normal">
              <span className="badge badge-normal">NORMAL</span>
              <h3>Normal Mode — 9×9</h3>
              <p>
                The classic 9×9 Sudoku with numbers 1–9 and 3×3 subgrids. The standard challenge
                that tests your logic to the fullest.
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Tips & Strategy</h2>
          <ul className="tips-list">
            <li>Start with rows, columns, or subgrids that already have many numbers filled in.</li>
            <li>Use elimination: if a number already appears in a row/column/subgrid, it can't appear again.</li>
            <li>Look for "naked singles" — cells where only one number is possible.</li>
            <li>Use arrow keys to navigate the grid and type numbers directly from your keyboard.</li>
            <li>Press Backspace or Delete to clear a cell. Use the ✕ button on mobile.</li>
            <li>Hit "Check Solution" at any time to highlight errors in red.</li>
          </ul>
        </div>

        <div className="card credits-card">
          <h2>Credits & Contact</h2>
          <p>Made with care by <strong>Jiajiu Zhang</strong></p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            CS 5610 — Full Stack Web Development, Northeastern University
          </p>
          <div className="credit-links">
            <a href="mailto:zhang.j48@northeastern.edu" className="credit-link">
              ✉️ zhang.j48@northeastern.edu
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="credit-link">
              💻 GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="credit-link">
              🔗 LinkedIn
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
