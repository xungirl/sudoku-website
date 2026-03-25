import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import {
  generatePuzzle,
  getConflicts,
  isBoardComplete,
  findHint,
} from '../utils/sudoku'

// ─── Context ──────────────────────────────────────────────────────────────────

const GameContext = createContext(null)

const LS_KEY = 'sudoku_game_state'

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  mode: null,           // 'easy' | 'normal'
  size: 9,
  board: [],            // number[][]  — current values (0 = empty)
  initialBoard: [],     // number[][]  — original puzzle (for Reset)
  prefilled: [],        // boolean[][] — cells that cannot be edited
  solution: [],         // number[][]  — complete solution
  conflicts: [],        // boolean[][] — cells violating Sudoku rules
  selectedCell: null,   // { row, col } | null
  timer: 0,             // seconds elapsed
  timerActive: false,
  isComplete: false,
  history: [],          // board snapshots for Undo
  hintMessage: null,    // transient hint feedback string
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    // ── New game ──────────────────────────────────────────────────────────────
    case 'INIT_GAME': {
      const size = action.mode === 'easy' ? 6 : 9
      const { puzzle, solution } = generatePuzzle(size)
      const prefilled = puzzle.map(r => r.map(v => v !== 0))
      const conflicts = getConflicts(puzzle, size)
      const newState = {
        ...initialState,
        mode: action.mode,
        size,
        board: puzzle.map(r => [...r]),
        initialBoard: puzzle.map(r => [...r]),
        prefilled,
        solution,
        conflicts,
        timerActive: true,
      }
      saveToLS(newState)
      return newState
    }

    // ── Restore from localStorage ─────────────────────────────────────────────
    case 'RESTORE_STATE': {
      const s = action.state
      // Validate saved state has required fields with correct types
      if (
        !s || !Array.isArray(s.board) || !s.board.length ||
        !Array.isArray(s.solution) || !s.solution.length ||
        !Array.isArray(s.prefilled) || !s.prefilled.length ||
        !Array.isArray(s.initialBoard) || !s.initialBoard.length ||
        typeof s.size !== 'number'
      ) {
        return initialState  // corrupt data — discard
      }
      return {
        ...initialState,
        ...s,
        conflicts: getConflicts(s.board, s.size),
        timerActive: !s.isComplete && s.board.length > 0,
        history: [],
      }
    }

    // ── Cell selection ────────────────────────────────────────────────────────
    case 'SELECT_CELL': {
      if (state.isComplete) return state
      return { ...state, selectedCell: action.payload, hintMessage: null }
    }

    // ── Arrow-key navigation ──────────────────────────────────────────────────
    case 'NAVIGATE_CELL': {
      if (!state.selectedCell || state.isComplete) return state
      let { row, col } = state.selectedCell
      if (action.dir === 'up')    row = Math.max(0, row - 1)
      if (action.dir === 'down')  row = Math.min(state.size - 1, row + 1)
      if (action.dir === 'left')  col = Math.max(0, col - 1)
      if (action.dir === 'right') col = Math.min(state.size - 1, col + 1)
      return { ...state, selectedCell: { row, col } }
    }

    // ── Input a number ────────────────────────────────────────────────────────
    case 'INPUT_VALUE': {
      const { selectedCell, prefilled, board, size, solution, history } = state
      if (!selectedCell || state.isComplete) return state
      const { row, col } = selectedCell
      if (prefilled[row][col]) return state
      const val = action.value
      if (val < 1 || val > size) return state

      const newHistory = [...history, board.map(r => [...r])]
      const newBoard = board.map((r, ri) =>
        r.map((v, ci) => (ri === row && ci === col ? val : v))
      )
      const conflicts  = getConflicts(newBoard, size)
      const isComplete = isBoardComplete(newBoard, solution, size)
      const newState = {
        ...state,
        board: newBoard,
        conflicts,
        history: newHistory,
        isComplete,
        timerActive: !isComplete,
        hintMessage: null,
      }
      if (!isComplete) saveToLS(newState)
      else localStorage.removeItem(LS_KEY)
      return newState
    }

    // ── Delete a number ───────────────────────────────────────────────────────
    case 'DELETE_VALUE': {
      const { selectedCell, prefilled, board, size, history } = state
      if (!selectedCell || state.isComplete) return state
      const { row, col } = selectedCell
      if (prefilled[row][col]) return state

      const newHistory = [...history, board.map(r => [...r])]
      const newBoard = board.map((r, ri) =>
        r.map((v, ci) => (ri === row && ci === col ? 0 : v))
      )
      const conflicts = getConflicts(newBoard, size)
      const newState = { ...state, board: newBoard, conflicts, history: newHistory, hintMessage: null }
      saveToLS(newState)
      return newState
    }

    // ── Undo ──────────────────────────────────────────────────────────────────
    case 'UNDO': {
      if (!state.history.length) return state
      const prevBoard = state.history[state.history.length - 1]
      const conflicts = getConflicts(prevBoard, state.size)
      const newState = {
        ...state,
        board: prevBoard,
        conflicts,
        history: state.history.slice(0, -1),
        hintMessage: null,
      }
      saveToLS(newState)
      return newState
    }

    // ── Reset to original puzzle ──────────────────────────────────────────────
    case 'RESET_GAME': {
      const newBoard = state.initialBoard.map(r => [...r])
      const conflicts = getConflicts(newBoard, state.size)
      const newState = {
        ...state,
        board: newBoard,
        conflicts,
        history: [],
        isComplete: false,
        timer: 0,
        timerActive: true,
        selectedCell: null,
        hintMessage: null,
      }
      saveToLS(newState)
      return newState
    }

    // ── Hint (Bonus) ──────────────────────────────────────────────────────────
    case 'HINT': {
      const hint = findHint(state.board, state.size)
      if (!hint) return { ...state, hintMessage: 'No single-answer cells found right now.' }

      // Fill in the value and record it in history
      const newHistory = [...state.history, state.board.map(r => [...r])]
      const newBoard = state.board.map((r, ri) =>
        r.map((v, ci) => (ri === hint.row && ci === hint.col ? hint.value : v))
      )
      const conflicts  = getConflicts(newBoard, state.size)
      const isComplete = isBoardComplete(newBoard, state.solution, state.size)
      const newState = {
        ...state,
        board: newBoard,
        conflicts,
        history: newHistory,
        selectedCell: { row: hint.row, col: hint.col },
        isComplete,
        timerActive: !isComplete,
        hintMessage: `Hint: (${hint.row + 1}, ${hint.col + 1}) can only be ${hint.value}`,
      }
      if (!isComplete) saveToLS(newState)
      else localStorage.removeItem(LS_KEY)
      return newState
    }

    // ── Timer tick ────────────────────────────────────────────────────────────
    case 'TICK_TIMER':
      return { ...state, timer: state.timer + 1 }

    // ── Clear hint message ────────────────────────────────────────────────────
    case 'CLEAR_HINT_MSG':
      return { ...state, hintMessage: null }

    default:
      return state
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function saveToLS(state) {
  try {
    // Don't save the full history to keep storage small — it's session data
    const toSave = { ...state, history: [] }
    localStorage.setItem(LS_KEY, JSON.stringify(toSave))
  } catch { /* storage full or unavailable */ }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timerRef = useRef(null)

  // Bonus: restore saved game on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) dispatch({ type: 'RESTORE_STATE', state: JSON.parse(saved) })
    } catch {
      localStorage.removeItem(LS_KEY)
    }
  }, [])

  // Timer management
  useEffect(() => {
    clearInterval(timerRef.current)
    if (state.timerActive) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK_TIMER' }), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [state.timerActive])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
