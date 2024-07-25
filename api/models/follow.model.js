import mongoose from 'mongoose';

const followsSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Ensure a user cannot follow the same person more than once
followsSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
const Follow = mongoose.model('Follow', followsSchema);

export default Follow;
