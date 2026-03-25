# Sudoku Master — Project 2 Writeup

**Course:** CS5610 Web Development
**GitHub:** https://github.com/xungirl/sudoku-website
**Live Site:** https://xungirl.github.io/sudoku-website/

---

## What were some challenges you faced while making this app?

The biggest challenge was implementing the Sudoku puzzle generator with a unique-solution guarantee. The backtracking algorithm needed to verify that removing each cell still left exactly one valid solution, which required writing a recursive solver with early termination. For the 9x9 board, the brute-force uniqueness check was too slow and would freeze the browser, so I had to optimize the solver with a Minimum Remaining Values (MRV) heuristic that prioritizes the most constrained cells first. Another challenge was managing complex game state across multiple components — tracking the board, prefilled cells, conflicts, selection, undo history, and timer all at once required careful design of the Context API store and reducer actions. Finally, deploying a single-page React app to GitHub Pages required switching from BrowserRouter to HashRouter since static hosting doesn't support server-side routing.

## Given more time, what additional features, functional or design changes would you make?

With more time, I would add a difficulty selector within each mode (e.g., Easy-Medium-Hard for 9x9) by varying the number of cells removed during generation. I would also implement a note/pencil-mark feature that lets users write candidate numbers in empty cells, which is essential for advanced solving techniques. Adding user authentication with a backend would allow persistent high scores and game history across sessions. I would also improve the mobile experience with swipe gestures for cell navigation and add animations for number placement and error highlighting to make the game feel more polished.

## What assumptions did you make while working on this assignment?

I assumed that the 6x6 Easy mode uses 2x3 sub-grids (2 rows by 3 columns per box) and starts with exactly 18 pre-filled cells (half the board), while the 9x9 Normal mode uses standard 3x3 sub-grids with approximately 29 pre-filled cells. I assumed that "values should be able to be changed later" means any user-entered value can be overwritten by clicking the cell and entering a new number, but pre-filled cells remain permanently locked. For the high scores and game selection pages, I used hardcoded mock data as specified in the assignment since no backend was required. I also assumed the hint system should automatically fill in the value for the user rather than just highlighting the cell, since the requirement states the cell "can accept a single, valid answer."

## How long did this assignment take to complete?

This assignment took approximately 15-18 hours to complete, including planning, implementation, debugging, and deployment.

## What bonus points did you accomplish?

### Local Storage (3 points)
Game state is persisted to `localStorage` after every player action (input, delete, undo, reset). When the app first opens, it checks for saved data and restores the game in progress. localStorage is only accessed through the React Context code (`GameContext.jsx`), and data is cleared when the game is completed or reset.
**Code:** [`src/context/GameContext.jsx`](src/context/GameContext.jsx) — see `saveToLS()` function (line ~203), `RESTORE_STATE` action (line ~60), and the `useEffect` restore on mount (line ~218).

### Backtracking — Unique Solution (4 points)
The puzzle generator uses a backtracking algorithm to ensure each generated board has exactly one valid solution. It first fills a complete valid board using recursive backtracking with the MRV heuristic, then removes cells one at a time. After each removal, a `countSolutions()` function checks whether the puzzle still has a unique solution (stops early after finding 2 solutions). If removing a cell creates multiple solutions, it is restored.
**Code:** [`src/utils/sudoku.js`](src/utils/sudoku.js) — see `generatePuzzle()` (line ~106), `countSolutions()` (line ~78), `fillBoard()` (line ~59), and `nextEmpty()` with MRV heuristic (line ~40).

### Hint System (5 points)
The Hint button finds a "naked single" — an empty cell where only one number is valid given the current board state (no other number can be placed without breaking Sudoku rules). When found, it automatically fills in that cell and shows a message indicating the position and value. The hint is undoable via the Undo button.
**Code:** [`src/utils/sudoku.js`](src/utils/sudoku.js) — see `findHint()` (line ~169). The hint action is dispatched in [`src/context/GameContext.jsx`](src/context/GameContext.jsx) — see `HINT` case (line ~162). The UI button is in [`src/pages/GamePage.jsx`](src/pages/GamePage.jsx) (line ~118).

---

## Tech Stack

- **React 18** with functional components and hooks
- **React Router v6** (HashRouter for static hosting)
- **Context API + useReducer** for state management
- **Vite** for build tooling
- **GitHub Pages** for deployment

## React Components (5+)

| Component | Description |
|-----------|-------------|
| `Navbar` | Fixed navigation bar with active link highlighting via React Router |
| `Board` | Renders the Sudoku grid; passes props to each Cell (parent → child) |
| `Cell` | Individual cell; receives props from Board; dispatches to Context on click (child → parent via state management, not callback) |
| `Timer` | Displays elapsed time from Context state |
| `NumberPad` | Clickable number buttons; dispatches INPUT_VALUE to Context |
| `ErrorBoundary` | Class component that catches and displays React errors |

## Pages / Routes

| Route | Page |
|-------|------|
| `/#/` | Home — title, features, call-to-action |
| `/#/games` | Selection — game list with difficulty filter |
| `/#/games/easy` | Easy 6x6 Sudoku (randomly generated) |
| `/#/games/normal` | Normal 9x9 Sudoku (randomly generated) |
| `/#/rules` | Rules + credits |
| `/#/scores` | Mock high scores leaderboard |
| `/#/login` | Login form (UI only) |
| `/#/register` | Register form (UI only) |
