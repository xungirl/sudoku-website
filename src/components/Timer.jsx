import { useGame } from '../context/GameContext'
import { formatTime } from '../utils/sudoku'

export default function Timer() {
  const { state } = useGame()
  return (
    <div className="timer-display" aria-live="polite" aria-label={`Timer: ${formatTime(state.timer)}`}>
      <span>⏱</span>
      <span>{formatTime(state.timer)}</span>
    </div>
  )
}
