import express from 'express';
import Game from '../models/Game.js';
import HighScore from '../models/HighScore.js';
import { generateGame } from '../utils/sudokuGenerator.js';
import { generateGameName } from '../utils/wordList.js';
import { verifyToken } from './user.js';

const router = express.Router();

// GET /api/sudoku
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({}, 'name difficulty createdBy createdAt').sort({ createdAt: -1 });
    res.json(games);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/sudoku
router.post('/', async (req, res) => {
  try {
    const payload = verifyToken(req);
    if (!payload) return res.status(401).json({ error: 'Must be logged in to create a game' });

    const { difficulty } = req.body;
    if (!['EASY', 'NORMAL'].includes(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty. Use EASY or NORMAL' });
    }

    const { puzzle, solution } = generateGame(difficulty);

    let name;
    let attempts = 0;
    do {
      name = generateGameName();
      attempts++;
    } while (attempts < 20 && (await Game.findOne({ name })));

    const game = new Game({ name, difficulty, puzzle, solution, createdBy: payload.username });
    await game.save();

    res.status(201).json({ _id: game._id, name: game.name });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/sudoku/:gameId
router.get('/:gameId', async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.json(game);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/sudoku/:gameId
router.put('/:gameId', async (req, res) => {
  try {
    const payload = verifyToken(req);
    if (!payload) return res.status(401).json({ error: 'Not authenticated' });

    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.createdBy !== payload.username) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { name } = req.body;
    if (name) game.name = name;
    await game.save();

    res.json(game);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/sudoku/:gameId
router.delete('/:gameId', async (req, res) => {
  try {
    const payload = verifyToken(req);
    if (!payload) return res.status(401).json({ error: 'Not authenticated' });

    const game = await Game.findById(req.params.gameId);
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (game.createdBy !== payload.username) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Game.findByIdAndDelete(req.params.gameId);
    await HighScore.deleteMany({ gameId: req.params.gameId });

    res.json({ message: 'Game deleted' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
