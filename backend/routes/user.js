import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sudoku-dev-secret';
const COOKIE = 'sudoku_token';

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  };
}

function signAndSet(res, username) {
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE, token, cookieOpts());
}

export function verifyToken(req) {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// GET /api/user/isLoggedIn
router.get('/isLoggedIn', (req, res) => {
  const payload = verifyToken(req);
  if (!payload) return res.status(401).json({ error: 'Not logged in' });
  res.json({ username: payload.username });
});

// POST /api/user/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    signAndSet(res, username);
    res.json({ username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    if (await User.findOne({ username })) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const user = new User({ username, password });
    await user.save();

    signAndSet(res, username);
    res.status(201).json({ username });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/user/logout
router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE);
  res.json({ message: 'Logged out' });
});

export default router;
