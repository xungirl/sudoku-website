import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['EASY', 'NORMAL'], required: true },
  puzzle: { type: [[Number]], required: true },
  solution: { type: [[Number]], required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Game', gameSchema);
