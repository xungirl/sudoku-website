function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isValid(board, row, col, num, size, boxR, boxC) {
  for (let i = 0; i < size; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const sr = Math.floor(row / boxR) * boxR;
  const sc = Math.floor(col / boxC) * boxC;
  for (let r = sr; r < sr + boxR; r++) {
    for (let c = sc; c < sc + boxC; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function fill(board, size, boxR, boxC) {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        for (const num of shuffle(Array.from({ length: size }, (_, i) => i + 1))) {
          if (isValid(board, row, col, num, size, boxR, boxC)) {
            board[row][col] = num;
            if (fill(board, size, boxR, boxC)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateGame(difficulty) {
  const isEasy = difficulty === 'EASY';
  const size = isEasy ? 6 : 9;
  const boxR = isEasy ? 2 : 3;
  const boxC = 3;
  const removeCount = isEasy ? 14 : 46;

  const solution = Array.from({ length: size }, () => Array(size).fill(0));
  fill(solution, size, boxR, boxC);

  const puzzle = solution.map((r) => [...r]);
  const positions = shuffle(Array.from({ length: size * size }, (_, i) => i));

  for (let i = 0; i < removeCount; i++) {
    const row = Math.floor(positions[i] / size);
    const col = positions[i] % size;
    puzzle[row][col] = 0;
  }

  return { puzzle, solution };
}
