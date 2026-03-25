import { useEffect, useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import Board from '../components/Board'
import Timer from '../components/Timer'
import NumberPad from '../components/NumberPad'
import { formatTime } from '../utils/sudoku'

export default function GamePage() {
  const { mode } = useParams()
  const { state, dispatch } = useGame()

  const validMode = mode === 'easy' || mode === 'normal'
  const isEasy = mode === 'easy'

  // ── Init or resume game (synchronous — generation is fast now) ──────────
  useEffect(() => {
    if (!validMode) return
    // Resume if a game of this mode already exists and is in progress
    if (state.mode === mode && state.board.length > 0 && !state.isComplete) return
    dispatch({ type: 'INIT_GAME', mode })
  }, [mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Keyboard handler ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!validMode) return
    const onKey = (e) => {
      if (state.isComplete) return
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
  }, [validMode, state.isComplete, state.size, dispatch])

  // ── Auto-clear hint message ────────────────────────────────────────────────
  useEffect(() => {
    if (!state.hintMessage) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_HINT_MSG' }), 4000)
    return () => clearTimeout(t)
  }, [state.hintMessage, dispatch])

  // ── New Game handler ───────────────────────────────────────────────────────
  const handleNewGame = useCallback(() => {
    dispatch({ type: 'INIT_GAME', mode })
  }, [dispatch, mode])

  // ── Guard invalid mode (AFTER all hooks) ───────────────────────────────────
  if (!validMode) return <Navigate to="/games" replace />

  // ── Board not ready yet ────────────────────────────────────────────────────
  if (!state.board.length) {
    return (
      <div className="container">
        <div className="game-page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div className="page-title">
            <h1>Generating Puzzle...</h1>
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

        {/* ── Board + NumberPad ────────────────────────────────────────────── */}
        <div className="sudoku-wrapper">
          <Board />
          <NumberPad />
        </div>

        {/* ── Hint message ────────────────────────────────────────────────── */}
        {state.hintMessage && (
          <div className="hint-msg">{state.hintMessage}</div>
        )}

        {/* ── Game controls ───────────────────────────────────────────────── */}
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

        {/* ── New Game + Reset ─────────────────────────────────────────────── */}
        <div className="game-bottom">
          <button className="btn btn-danger" onClick={() => dispatch({ type: 'RESET_GAME' })}>
            ↺ Reset
          </button>
          <button className="btn btn-primary" onClick={handleNewGame}>
            + New Game
          </button>
        </div>

        {/* ── Congratulations ──────────────────────────────────────────────── */}
        {state.isComplete && (
          <div className="congrats-banner">
            <h2>🎉 Congratulations!</h2>
            <p>
              You solved the {isEasy ? 'Easy 6×6' : 'Normal 9×9'} puzzle
              in <strong>{formatTime(state.timer)}</strong>!
            </p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleNewGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
