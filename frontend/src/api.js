async function request(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(data.error || res.statusText);
  }
  return res.json();
}

export const isLoggedIn = () => request('GET', '/user/isLoggedIn');
export const login = (username, password) => request('POST', '/user/login', { username, password });
export const register = (username, password) => request('POST', '/user/register', { username, password });
export const logout = () => request('POST', '/user/logout');

export const getGames = () => request('GET', '/sudoku');
export const createGame = (difficulty) => request('POST', '/sudoku', { difficulty });
export const getGame = (id) => request('GET', `/sudoku/${id}`);
export const deleteGame = (id) => request('DELETE', `/sudoku/${id}`);
export const updateGame = (id, data) => request('PUT', `/sudoku/${id}`, data);

export const getHighScores = () => request('GET', '/highscore');
export const postHighScore = (gameId) => request('POST', '/highscore', { gameId });
export const getGameHighScore = (gameId) => request('GET', `/highscore/${gameId}`);
