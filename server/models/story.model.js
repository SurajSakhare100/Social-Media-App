import mongoose, { Schema } from 'mongoose';

const storySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '24h', // Auto-delete story after 24 hours
    },}
);

storySchema.index({ userId: 1 });
storySchema.index({ userId: 1, expirationTime: 1 });

const Story = mongoose.model('Story', storySchema);

export default Story;
