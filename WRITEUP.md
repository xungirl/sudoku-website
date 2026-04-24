# CS5610 Project 3 — Sudoku Master (Full Stack)

**Student:** Jiajiu Zhang
**Course:** CS5610 Web Development, Northeastern University
**Semester:** Spring 2026

---

## Links

| Resource | URL |
|---|---|
| **Live App** | https://sudoku-website-88ro.onrender.com |
| **GitHub Repository** | https://github.com/xungirl/sudoku-website (branch: `project3`) |
| **Demo Video** | https://drive.google.com/file/d/1kVSo1Bomigl4XzaHQlaQJ14n0cxUu8fI/view?usp=sharing |

---

## Project Overview

Sudoku Master is a full-stack web application that extends the static Project 2 Sudoku site into a complete MERN-stack application. Users can register, log in, create and play Sudoku puzzles in two difficulty modes, and compete on a global leaderboard.

---

## Technical Stack

### Frontend
- **React 18** with functional components and hooks
- **React Router v6** for client-side routing (7 pages)
- **Vite** as the build tool and dev server
- **Custom CSS** with CSS variables — consistent dark theme across all pages
- **Context API** (`AuthContext`) for global authentication state
- **localStorage** for persisting in-progress game state per user

### Backend
- **Node.js + Express** RESTful API server
- **Mongoose + MongoDB Atlas** for data persistence
- **JSON Web Tokens (JWT)** stored in `httpOnly` cookies for session management
- **bcrypt** (10 rounds) for password hashing
- **cookie-parser** middleware for reading auth cookies

### Deployment
- **Render** (Web Service) — serves both frontend build and backend API from a single Node process
- **MongoDB Atlas** (M0 Free Tier) — cloud-hosted database

---

## Application Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero animation and feature highlights |
| `/games` | Game Selection | Create new EASY/NORMAL games; browse all existing games |
| `/game/:gameId` | Game Board | Interactive Sudoku grid with keyboard + number pad input |
| `/rules` | Rules | How-to-play guide, difficulty explanations, credits |
| `/scores` | High Scores | Leaderboard sorted by total wins (medals for top 3) |
| `/login` | Login | Username/password login; submit disabled when fields empty |
| `/register` | Register | Registration with password confirmation field |

---

## RESTful API Reference

### User APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/user/isLoggedIn` | Validates cookie and returns username |
| `POST` | `/api/user/login` | Authenticates user and sets `httpOnly` JWT cookie |
| `POST` | `/api/user/register` | Creates new user (bcrypt hashed password) and sets cookie |
| `POST` | `/api/user/logout` | Clears auth cookie |

### Sudoku APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sudoku` | Returns list of all games (name, difficulty, creator, date) |
| `POST` | `/api/sudoku` | Generates a new puzzle; returns `{ _id, name }` |
| `GET` | `/api/sudoku/:gameId` | Returns full game including puzzle and solution |
| `PUT` | `/api/sudoku/:gameId` | Updates game name (creator only) |
| `DELETE` | `/api/sudoku/:gameId` | Deletes game and all associated scores (creator only) |

### High Score APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/highscore` | Returns leaderboard sorted by wins descending |
| `POST` | `/api/highscore` | Records a game completion for the logged-in user |
| `GET` | `/api/highscore/:gameId` | Returns all completions for a specific game |

---

## Database Schema

### `users` Collection
```js
{
  username: String (unique),
  password: String (bcrypt hashed),
  createdAt: Date
}
```

### `games` Collection
```js
{
  name:       String (unique, 3 random words from 1007-word list),
  difficulty: "EASY" | "NORMAL",
  puzzle:     Number[][],   // 0 = empty cell
  solution:   Number[][],
  createdBy:  String,
  createdAt:  Date
}
```

### `highscores` Collection
```js
{
  username:    String,
  gameId:      ObjectId (ref: Game),
  completedAt: Date
  // unique compound index on (username, gameId)
}
```

---

## Sudoku Generation Algorithm

Both 6×6 (EASY) and 9×9 (NORMAL) puzzles are generated server-side at the time of game creation using a **randomized backtracking algorithm**:

1. Start with an empty grid filled with zeros
2. Iterate cells left-to-right, top-to-bottom
3. For each empty cell, try a shuffled list of valid numbers
4. Validate against row, column, and subgrid constraints
5. Recurse; backtrack if no valid number exists
6. Once a complete solution is generated, randomly remove cells to form the puzzle (14 cells removed for EASY, 46 for NORMAL)

Subgrid dimensions: **2×3** for 6×6 boards, **3×3** for 9×9 boards.

---

## Bonus Points Completed

### ✅ Password Encryption (+2 pts)
All passwords are hashed with **bcrypt** (10 salt rounds) before storage. Plain-text passwords are never persisted to the database.

- Code: [`backend/models/User.js`](https://github.com/xungirl/sudoku-website/blob/project3/backend/models/User.js)

```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### ✅ Delete Game (+5 pts)
When the logged-in user is the creator of a game, a **Delete Game** button appears on the game page. Clicking it:
1. Calls `DELETE /api/sudoku/:gameId` (auth-gated, creator-only)
2. Removes the game document from MongoDB
3. Cascades: deletes all associated `HighScore` records for that game (so win counts are correctly updated)
4. Redirects the user back to `/games`

- Code: [`backend/routes/sudoku.js`](https://github.com/xungirl/sudoku-website/blob/project3/backend/routes/sudoku.js) — `DELETE /:gameId`
- Frontend: [`frontend/src/pages/Game.jsx`](https://github.com/xungirl/sudoku-website/blob/project3/frontend/src/pages/Game.jsx) — `handleDelete`

---

## Challenges Faced

1. **Sudoku generator correctness** — The backtracking algorithm for the 6×6 board required careful handling of 2×3 subgrid dimensions (boxRows=2, boxCols=3) versus the 9×9's 3×3 subgrids. An off-by-one in the subgrid origin calculation caused invalid puzzles during early testing.

2. **Cookie behavior across environments** — `httpOnly` cookies with `secure: true` (production) vs `secure: false` (development) required conditional logic. Additionally, the Vite dev server proxy (`/api → localhost:8000`) was needed to avoid CORS issues during local development since cookies are same-origin.

3. **Render build failing with `vite: not found`** — Render sets `NODE_ENV=production` by default, which causes `npm install` to skip `devDependencies`. The fix was adding `--include=dev` to the frontend install step in the root build script.

4. **Consistent completed-game state** — Determining whether a specific user had already completed a game required cross-referencing the `HighScore` collection on every game page load. Managing this alongside localStorage-persisted in-progress state required careful sequencing in the `useEffect` on the Game page.

---

## Given More Time

- **Timer** — Add a per-game countdown/stopwatch and record completion time in the HighScore model to break ties on the leaderboard
- **Hint system** — Reveal one correct cell on request (with a limited hint budget per game)
- **Custom Games (backtracking uniqueness check)** — Allow users to submit their own puzzle layout and validate server-side that it has exactly one solution
- **Mobile number pad UX** — Replace the grid's click-then-numberpad flow with a bottom-sheet picker on small screens
- **OAuth login** — Support GitHub or Google login in addition to username/password

---

## Assumptions Made

- A "win" is defined as any user completing any game puzzle, regardless of difficulty or whether another user already completed the same puzzle.
- Guest users (not logged in) may view all pages and see the puzzle grid, but cannot input numbers, create games, or submit scores.
- Game progress (partially filled cells) is stored in `localStorage` keyed by `gameId + username`, so it persists across browser sessions for logged-in users but is not synced to the database.
- Unique game names are generated by picking 3 random words from a 1,007-word list. Collision retry logic runs up to 20 attempts before falling back to the last generated name.
- Passwords are assumed to contain only ASCII characters; no special URL-encoding is required for the bcrypt comparison.

---

## Time Estimate

| Phase | Time |
|---|---|
| Backend (models, routes, generator, word list) | ~4 hours |
| Frontend (all pages, components, CSS, routing) | ~4 hours |
| Integration, debugging, and deployment (Render + Atlas) | ~2 hours |
| **Total** | **~10 hours** |
