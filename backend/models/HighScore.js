import mongoose from 'mongoose';

const highScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  completedAt: { type: Date, default: Date.now },
});

highScoreSchema.index({ username: 1, gameId: 1 }, { unique: true });

export default mongoose.model('HighScore', highScoreSchema);
