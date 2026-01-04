const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String
}, { timestamps: true });

// ✅ FIXED: Remove ALL middleware - Simple direct hashing
userSchema.methods.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
