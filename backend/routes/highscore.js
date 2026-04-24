import express from 'express';
import HighScore from '../models/HighScore.js';
import Game from '../models/Game.js';
import { verifyToken } from './user.js';

const router = express.Router();

// GET /api/highscore — sorted leaderboard
router.get('/', async (req, res) => {
  try {
    const scores = await HighScore.aggregate([
      { $group: { _id: '$username', wins: { $sum: 1 } } },
      { $sort: { wins: -1, _id: 1 } },
      { $project: { username: '$_id', wins: 1, _id: 0 } },
    ]);
    res.json(scores);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/highscore — record a completion
router.post('/', async (req, res) => {
  try {
    const payload = verifyToken(req);
    if (!payload) return res.status(401).json({ error: 'Must be logged in' });

    const { gameId } = req.body;
    if (!gameId) return res.status(400).json({ error: 'Missing gameId' });

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const score = new HighScore({ username: payload.username, gameId });
    await score.save();
    res.status(201).json({ message: 'Score recorded' });
  } catch (err) {
    if (err.code === 11000) return res.status(200).json({ message: 'Already completed' });
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/highscore/:gameId — completions for a specific game
router.get('/:gameId', async (req, res) => {
  try {
    const scores = await HighScore.find({ gameId: req.params.gameId }).sort({ completedAt: 1 });
    res.json(scores);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
