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
    expirationTime: {
      type: Date,
      default: function() {
        // Set expirationTime to 1 day from now
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day in milliseconds
      },
    },
  },
  {
    timestamps: true,
  }
);

storySchema.index({ userId: 1 });
storySchema.index({ userId: 1, expirationTime: 1 });

const Story = mongoose.model('Story', storySchema);

export default Story;
