import mongoose from 'mongoose';

const followsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Ensure a user cannot follow the same person more than once
followsSchema.index({ user: 1, following: 1 }, { unique: true });

const Follow = mongoose.model('Follow', followsSchema);

export default Follow;
