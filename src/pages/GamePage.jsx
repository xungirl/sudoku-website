import { useEffect, useState, useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import Board from '../components/Board'
import Timer from '../components/Timer'
import NumberPad from '../components/NumberPad'
import { formatTime } from '../utils/sudoku'

export default function GamePage() {
  const { mode } = useParams()
  const { state, dispatch } = useGame()
  const [loading, setLoading] = useState(false)

  const validMode = mode === 'easy' || mode === 'normal'
  const isEasy = mode === 'easy'

  // ── Init or resume game ────────────────────────────────────────────────────
  useEffect(() => {
    if (!validMode) return
    // If a game of this mode is already in progress, resume it
    if (state.mode === mode && state.board.length > 0 && !state.isComplete) return

    setLoading(true)
    // Use setTimeout to let loading UI render before heavy generation
    const t = setTimeout(() => {
      dispatch({ type: 'INIT_GAME', mode })
      setLoading(false)
    }, 50)
    return () => clearTimeout(t)
  }, [mode, validMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard handler ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!validMode) return
    const onKey = (e) => {
      if (state.isComplete || loading) return
      const k = e.key

      if (k === 'Backspace' || k === 'Delete' || k === '0') {
        dispatch({ type: 'DELETE_VALUE' })
      } else if (k >= '1' && k <= String(state.size)) {
        dispatch({ type: 'INPUT_VALUE', value: parseInt(k, 10) })
      } else if (k === 'ArrowUp')    { e.preventDefault(); dispatch({ type: 'NAVIGATE_CELL', dir: 'up' }) }
      else if (k === 'ArrowDown')    { e.preventDefault(); dispatch({ type: 'NAVIGATE_CELL', dir: 'down' }) }
      else if (k === 'ArrowLeft')    { e.preventDefault(); dispatch({ type: 'NAVIGATE_CELL', dir: 'left' }) }
      else if (k === 'ArrowRight')   { e.preventDefault(); dispatch({ type: 'NAVIGATE_CELL', dir: 'right' }) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [validMode, state.isComplete, state.size, loading, dispatch])

  // ── Auto-clear hint message after 4 s ─────────────────────────────────────
  useEffect(() => {
    if (!state.hintMessage) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_HINT_MSG' }), 4000)
    return () => clearTimeout(t)
  }, [state.hintMessage, dispatch])

  // ── New Game handler (with loading) ────────────────────────────────────────
  const handleNewGame = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      dispatch({ type: 'INIT_GAME', mode })
      setLoading(false)
    }, 50)
  }, [dispatch, mode])

  // ── Guard invalid mode (AFTER all hooks!) ──────────────────────────────────
  if (!validMode) return <Navigate to="/games" replace />

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading || state.board.length === 0) {
    return (
      <div className="container">
        <div className="game-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div className="page-title">
            <h1>Generating Puzzle...</h1>
            <p>Creating a {isEasy ? '6×6 Easy' : '9×9 Normal'} board with a unique solution</p>
          </div>
          <div className="loading-spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="game-page">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="game-header">
          <div>
            <span className={`game-mode-badge game-mode-badge--${isEasy ? 'easy' : 'normal'}`}>
              {isEasy ? '🟢 Easy 6×6' : '🔴 Normal 9×9'}
            </span>
          </div>
          <Timer />
        </div>

        {/* ── Board (nested: Board → Cell) ────────────────────────────────── */}
        <div className="sudoku-wrapper">
          <Board />
          <NumberPad />
        </div>

        {/* ── Hint message ────────────────────────────────────────────────── */}
        {state.hintMessage && (
          <div className="hint-msg">{state.hintMessage}</div>
        )}

        {/* ── Game control buttons ────────────────────────────────────────── */}
        <div className="game-controls">
          <button
            className="btn btn-secondary"
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!state.history.length || state.isComplete}
          >↩ Undo</button>

          <button
            className="btn btn-secondary"
            onClick={() => dispatch({ type: 'HINT' })}
            disabled={state.isComplete}
          >💡 Hint</button>
        </div>

        {/* ── Bottom buttons (New Game + Reset) ───────────────────────────── */}
        <div className="game-bottom">
          <button
            className="btn btn-danger"
            onClick={() => dispatch({ type: 'RESET_GAME' })}
          >↺ Reset</button>

          <button
            className="btn btn-primary"
            onClick={handleNewGame}
          >+ New Game</button>
        </div>

        {/* ── Congratulations banner ──────────────────────────────────────── */}
        {state.isComplete && (
          <div className="congrats-banner">
            <h2>🎉 Congratulations!</h2>
            <p>
              You solved the {isEasy ? 'Easy 6×6' : 'Normal 9×9'} puzzle
              in <strong>{formatTime(state.timer)}</strong>!
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={handleNewGame}
            >Play Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
