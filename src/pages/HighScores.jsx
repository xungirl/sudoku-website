const SCORES = [
  { username: 'Elisa',      completed: 284, best: '03:12' },
  { username: 'Wong',       completed: 251, best: '04:05' },
  { username: 'ninja_nine', completed: 198, best: '05:22' },
  { username: 'sudoku_pro', completed: 175, best: '05:47' },
  { username: 'MindBender', completed: 143, best: '06:11' },
  { username: 'PuzzlePete', completed: 120, best: '07:03' },
  { username: 'xungirl',    completed: 97,  best: '08:34' },
  { username: 'quick_six',  completed: 82,  best: '02:55' },
]

const MEDALS = ['🥇', '🥈', '🥉']

export default function HighScores() {
  return (
    <div className="container">
      <div className="page-title">
        <h1>High Scores</h1>
        <p>Top solvers ranked by number of completed puzzles.</p>
      </div>

      <div className="card" style={{ maxWidth: 700, margin: '0 auto', padding: '1.5rem' }}>
        <table className="scores-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Puzzles Completed</th>
              <th>Best Time</th>
            </tr>
          </thead>
          <tbody>
            {SCORES.map((s, i) => (
              <tr key={i}>
                <td className="rank">{MEDALS[i] ?? `#${i + 1}`}</td>
                <td>{s.username}</td>
                <td className="score">{s.completed}</td>
                <td style={{ color: 'var(--secondary)' }}>{s.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <p>© 2025 Sudoku Master</p>
      </footer>
    </div>
  )
}
