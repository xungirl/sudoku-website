// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Returns [startRow, startCol, boxHeight, boxWidth] for a cell */
function boxOf(row, col, size) {
  if (size === 6) return [Math.floor(row / 2) * 2, Math.floor(col / 3) * 3, 2, 3]
  return [Math.floor(row / 3) * 3, Math.floor(col / 3) * 3, 3, 3]
}

// ─── Placement Validation ─────────────────────────────────────────────────────

/** True if placing `num` at (row,col) does not violate any Sudoku rule.
 *  Ignores any existing value already at that cell. */
export function isValidPlacement(board, row, col, num, size) {
  for (let c = 0; c < size; c++)
    if (c !== col && board[row][c] === num) return false

  for (let r = 0; r < size; r++)
    if (r !== row && board[r][col] === num) return false

  const [sr, sc, bh, bw] = boxOf(row, col, size)
  for (let r = sr; r < sr + bh; r++)
    for (let c = sc; c < sc + bw; c++)
      if ((r !== row || c !== col) && board[r][c] === num) return false

  return true
}

// ─── Board Filling (backtracking with MRV) ────────────────────────────────────

/** Find the empty cell with the fewest valid options (MRV heuristic). */
function nextEmpty(board, size) {
  let best = null, bestCount = size + 1
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== 0) continue
      let count = 0
      for (let n = 1; n <= size; n++)
        if (isValidPlacement(board, r, c, n, size)) count++
      if (count < bestCount) {
        bestCount = count
        best = { r, c }
        if (count === 0) return { r, c, dead: true }
        if (count === 1) return { r, c }
      }
    }
  }
  return best
}

function fillBoard(board, size) {
  const cell = nextEmpty(board, size)
  if (!cell) return true          // no empty cells → solved
  if (cell.dead) return false     // dead end

  const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1))
  for (const n of nums) {
    if (isValidPlacement(board, cell.r, cell.c, n, size)) {
      board[cell.r][cell.c] = n
      if (fillBoard(board, size)) return true
      board[cell.r][cell.c] = 0
    }
  }
  return false
}

// ─── Unique-Solution Check (Bonus: Backtracking) ──────────────────────────────

/** Count solutions up to `limit`.  Returns early once limit is reached. */
function countSolutions(board, size, limit = 2) {
  let count = 0
  function solve(b) {
    if (count >= limit) return
    const cell = nextEmpty(b, size)
    if (!cell) { count++; return }
    if (cell.dead) return
    for (let n = 1; n <= size; n++) {
      if (count >= limit) return
      if (isValidPlacement(b, cell.r, cell.c, n, size)) {
        b[cell.r][cell.c] = n
        solve(b)
        b[cell.r][cell.c] = 0
      }
    }
  }
  solve(board.map(r => [...r]))
  return count
}

// ─── Puzzle Generator ─────────────────────────────────────────────────────────

/**
 * Generates a Sudoku puzzle with a unique solution.
 * Uses backtracking to ensure uniqueness (Bonus feature).
 * @param {6|9} size
 * @returns {{ puzzle: number[][], solution: number[][] }}
 */
export function generatePuzzle(size) {
  // 1. Fill a complete valid board
  const solution = Array.from({ length: size }, () => Array(size).fill(0))
  fillBoard(solution, size)

  // 2. Remove cells while maintaining unique solution
  const puzzle = solution.map(r => [...r])
  const targetFilled = size === 6 ? 18 : 29
  let filled = size * size

  const positions = shuffle(
    Array.from({ length: size * size }, (_, i) => [Math.floor(i / size), i % size])
  )

  const deadline = Date.now() + (size === 9 ? 4000 : 1500)

  for (const [r, c] of positions) {
    if (filled <= targetFilled) break
    if (Date.now() > deadline) break   // safety: stop if taking too long

    const backup = puzzle[r][c]
    puzzle[r][c] = 0

    if (countSolutions(puzzle, size) === 1) {
      filled--
    } else {
      puzzle[r][c] = backup           // restore: would create non-unique puzzle
    }
  }

  return { puzzle, solution }
}

// ─── Conflict Detection ───────────────────────────────────────────────────────

/** Returns a 2-D boolean array: true where a cell's value conflicts with rules. */
export function getConflicts(board, size) {
  const conflicts = Array.from({ length: size }, () => Array(size).fill(false))
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = board[r][c]
      if (v === 0) continue
      if (!isValidPlacement(board, r, c, v, size)) conflicts[r][c] = true
    }
  }
  return conflicts
}

// ─── Completion Check ─────────────────────────────────────────────────────────

export function isBoardComplete(board, solution, size) {
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] !== solution[r][c]) return false
  return true
}

// ─── Hint Finder (Bonus: Hint System) ────────────────────────────────────────

/**
 * Finds a "naked single": an empty cell with exactly one valid placement.
 * @returns {{ row, col, value } | null}
 */
export function findHint(board, size) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] !== 0) continue
      const valid = []
      for (let n = 1; n <= size; n++)
        if (isValidPlacement(board, r, c, n, size)) valid.push(n)
      if (valid.length === 1) return { row: r, col: c, value: valid[0] }
    }
  }
  return null
}

// ─── Timer Formatting ─────────────────────────────────────────────────────────

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
