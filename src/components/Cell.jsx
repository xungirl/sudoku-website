import { useGame } from '../context/GameContext'

/**
 * Individual Sudoku cell.
 * Receives props from Board (parent) — satisfies "props from parent" requirement.
 * Communicates back via Context dispatch — satisfies "no function callback" requirement.
 */
export default function Cell({
  value,
  prefilled,
  isError,
  isSelected,
  isHighlighted,
  isSameNumber,
  isBoxRight,
  isBoxBottom,
  row,
  col,
}) {
  const { dispatch } = useGame()

  const handleClick = () => {
    // Data flows child → parent via Context (not a prop callback)
    dispatch({ type: 'SELECT_CELL', payload: { row, col } })
  }

  let cls = 'cell'
  if (prefilled)             cls += ' cell--prefilled'
  if (isSelected)            cls += ' cell--selected'
  else if (isSameNumber)     cls += ' cell--same'
  else if (isHighlighted)    cls += ' cell--highlighted'
  if (isError)               cls += ' cell--error'
  if (isBoxRight)            cls += ' cell--box-right'
  if (isBoxBottom)           cls += ' cell--box-bottom'

  return (
    <div
      className={cls}
      onClick={handleClick}
      role="gridcell"
      aria-label={`Row ${row + 1}, Column ${col + 1}${value ? `, value ${value}` : ', empty'}`}
    >
      {value !== 0 ? value : ''}
    </div>
  )
}
