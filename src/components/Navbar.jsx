import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">Sudoku Master</NavLink>
      <ul className="nav-links">
        <li><NavLink to="/"       end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/games"  className={({ isActive }) => isActive ? 'active' : ''}>Play</NavLink></li>
        <li><NavLink to="/rules"  className={({ isActive }) => isActive ? 'active' : ''}>Rules</NavLink></li>
        <li><NavLink to="/scores" className={({ isActive }) => isActive ? 'active' : ''}>Scores</NavLink></li>
        <li><NavLink to="/login"  className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
        <li><NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink></li>
      </ul>
    </nav>
  )
}
