import { useGame } from '../context/GameContext'
import Cell from './Cell'

/**
 * Renders the Sudoku grid and passes props down to each Cell.
 * Nested component: Board → Cell.
 */
export default function Board() {
  const { state } = useGame()
  const { board, prefilled, conflicts, selectedCell, size } = state

  if (!board.length) return null

  const [boxH, boxW] = size === 6 ? [2, 3] : [3, 3]

  return (
    <div className={`sudoku-grid sudoku-grid--${size}`} role="grid" aria-label="Sudoku board">
      {board.map((row, ri) =>
        row.map((val, ci) => {
          // ── Thick-border flags ───────────────────────────────────────────
          const isBoxRight  = (ci + 1) % boxW === 0 && ci !== size - 1
          const isBoxBottom = (ri + 1) % boxH === 0 && ri !== size - 1

          // ── Highlight logic ──────────────────────────────────────────────
          let isHighlighted = false
          let isSameNumber  = false

          if (selectedCell) {
            const { row: sr, col: sc } = selectedCell
            const selVal = board[sr][sc]

            if (ri === sr || ci === sc) {
              isHighlighted = true
            } else if (
              Math.floor(ri / boxH) === Math.floor(sr / boxH) &&
              Math.floor(ci / boxW) === Math.floor(sc / boxW)
            ) {
              isHighlighted = true
            }

            if (selVal !== 0 && val === selVal) isSameNumber = true
          }

          return (
            <Cell
              key={`${ri}-${ci}`}
              value={val}
              prefilled={prefilled[ri][ci]}
              isError={conflicts[ri][ci]}
              isSelected={selectedCell?.row === ri && selectedCell?.col === ci}
              isHighlighted={isHighlighted}
              isSameNumber={isSameNumber}
              isBoxRight={isBoxRight}
              isBoxBottom={isBoxBottom}
              row={ri}
              col={ci}
            />
          )
        })
      )}
    </div>
  )
}
