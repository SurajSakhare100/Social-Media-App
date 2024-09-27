import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Define the user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Ensure email is always stored in lowercase
    trim: true, // Trim whitespace
  },
  profileName: {
    type: String,
    default: '', // Add a default value
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  refreshToken: {
    type: String,
    default: null, // Default value for clarity
  },
  provider: {
    type: String,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (currentPassword) {
  return await bcrypt.compare(currentPassword, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m', // Default expiry if not defined
    }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d', // Default expiry if not defined
    }
  );
};

// Create and export User model
const User = mongoose.model('User', userSchema);
export default User;
