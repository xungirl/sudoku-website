import { useGame } from '../context/GameContext'

export default function NumberPad() {
  const { state, dispatch } = useGame()
  const { size, isComplete } = state

  const handleNumber = (n) => dispatch({ type: 'INPUT_VALUE', value: n })
  const handleDelete = ()  => dispatch({ type: 'DELETE_VALUE' })

  return (
    <div className="number-pad" role="group" aria-label="Number input pad">
      {Array.from({ length: size }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          className="num-btn"
          onClick={() => handleNumber(n)}
          disabled={isComplete}
          aria-label={`Enter ${n}`}
        >
          {n}
        </button>
      ))}
      <button
        className="num-btn num-btn--delete"
        onClick={handleDelete}
        disabled={isComplete}
        aria-label="Delete"
      >
        ⌫
      </button>
    </div>
  )
}
