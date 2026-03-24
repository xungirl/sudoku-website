import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Selection from './pages/Selection'
import GamePage from './pages/GamePage'
import Rules from './pages/Rules'
import HighScores from './pages/HighScores'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/games"        element={<Selection />} />
          <Route path="/games/:mode"  element={<GamePage />} />
          <Route path="/rules"        element={<Rules />} />
          <Route path="/scores"       element={<HighScores />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/register"     element={<Register />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
