import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    verificationCode: { type: String, required: true },
    expiresAt: { type: Date, required: true } // Field for TTL
});

// Set TTL index to automatically delete documents when 'expiresAt' date is reached
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Verification = mongoose.model('Verification', verificationSchema);

export default Verification;
