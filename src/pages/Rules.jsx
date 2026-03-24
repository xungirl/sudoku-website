export default function Rules() {
  return (
    <div className="container">
      <div className="page-title">
        <h1>Rules</h1>
        <p>Learn how to play Sudoku.</p>
      </div>

      <div className="card" style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="rules-grid">
          <section className="rules-section">
            <h2>How to Play</h2>
            <p>
              Sudoku is a logic puzzle played on a grid divided into rows, columns, and boxes.
              Fill every cell so each row, column, and box contains the allowed numbers exactly once.
            </p>
            <ol>
              <li>Each <strong>row</strong> must contain each number exactly once.</li>
              <li>Each <strong>column</strong> must contain each number exactly once.</li>
              <li>Each <strong>box</strong> (sub-grid) must contain each number exactly once.</li>
              <li><strong>Pre-filled</strong> cells cannot be changed — use them as clues.</li>
            </ol>
          </section>

          <section className="rules-section">
            <h2>Modes</h2>
            <p>
              <strong>Easy (6×6):</strong> Uses numbers 1–6 with 2×3 sub-grids.
              Half the cells are pre-filled, great for beginners.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              <strong>Normal (9×9):</strong> The classic Sudoku with numbers 1–9
              and 3×3 sub-grids. ~30 cells are pre-filled.
            </p>

            <h2 style={{ marginTop: '1.25rem' }}>Tips</h2>
            <ul>
              <li>Start with rows or columns that have the most given numbers.</li>
              <li>Use elimination: if 8 numbers are placed, the last one is forced.</li>
              <li>Cells highlighted in red violate the rules — fix them first.</li>
              <li>Press <kbd>💡 Hint</kbd> to reveal a cell with only one valid answer.</li>
            </ul>
          </section>
        </div>

        <hr className="rules-divider" />

        <section className="rules-section">
          <h2>Credits / Made By</h2>
          <p>
            This project was built for CS5610 Applied Web Development at Northeastern University.
          </p>
          <div className="credit-links">
            <a href="mailto:xun@example.com">xun@example.com</a>
            <a href="https://github.com/xungirl" target="_blank" rel="noreferrer">GitHub — xungirl</a>
            <a href="https://www.linkedin.com/in/xun-example/" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </section>
      </div>

      <footer className="footer">
        <p>© 2025 Sudoku Master</p>
      </footer>
    </div>
  )
}
