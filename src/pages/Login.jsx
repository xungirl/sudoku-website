import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="container">
      <div className="page-title">
        <h1>Login</h1>
        <p>Welcome back, puzzle master!</p>
      </div>

      <div className="auth-wrap">
        <div className="card auth-card">
          <div className="auth-header">
            <div className="logo-icon">🧩</div>
            <h2>Sign In</h2>
            <p>Enter your credentials to continue</p>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>

          <div className="remember-row">
            <label>
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          <button className="btn btn-primary auth-submit">Sign In</button>

          <div className="auth-divider">or</div>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>

      <footer className="footer">
        <p>© 2025 Sudoku Master</p>
      </footer>
    </div>
  )
}
