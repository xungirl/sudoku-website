import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))
      ? 'active'
      : '';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-text">Sudoku Master</span>
      </Link>

      <ul className="nav-links">
        <li><Link to="/" className={isActive('/')}>Home</Link></li>
        <li><Link to="/games" className={isActive('/games')}>Play</Link></li>
        <li><Link to="/rules" className={isActive('/rules')}>Rules</Link></li>
        <li><Link to="/scores" className={isActive('/scores')}>Scores</Link></li>

        {user ? (
          <>
            <li className="nav-user">
              <span className="nav-username">{user}</span>
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
            <li>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
