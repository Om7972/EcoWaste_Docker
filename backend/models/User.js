const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['citizen', 'admin', 'collector'], default: 'citizen' },
  avatar: { type: String, default: '' },
  rewardPoints: { type: Number, default: 0 },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRE || '30d' });
};

module.exports = mongoose.model('User', userSchema);
