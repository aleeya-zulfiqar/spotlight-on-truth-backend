const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  displayName: { type: String, default: 'Anonymous' },
  roles: { type: [String], default: ['user'] },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, {
    toJSON: { virtuals: true },
    toObject: {virtuals: true }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);