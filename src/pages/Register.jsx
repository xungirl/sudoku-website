import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="container">
      <div className="page-title">
        <h1>Register</h1>
        <p>Create a new account to track your progress.</p>
      </div>

      <div className="auth-wrap">
        <div className="card auth-card">
          <div className="auth-header">
            <div className="logo-icon">🧩</div>
            <h2>Create Account</h2>
            <p>Join Sudoku Master today</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Choose a username" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Create a password" />
          </div>

          <div className="form-group">
            <label htmlFor="verify-password">Verify Password</label>
            <input type="password" id="verify-password" placeholder="Re-enter your password" />
          </div>

          <button className="btn btn-primary auth-submit">Create Account</button>

          <div className="auth-divider">or</div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Sudoku Master</p>
      </footer>
    </div>
  )
}
