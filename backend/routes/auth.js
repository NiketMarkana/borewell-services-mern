const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

// User Schema with ROLES
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }  // ✅ NEW: Roles
});
const User = mongoose.model('User', userSchema);

// ✅ REGISTER (User/Admin based on email)
router.post('/register', async (req, res) => {
  try {
    console.log('📥 Register data:', req.body);

    const { name, email, password, phone } = req.body;

    // Admin emails (hardcoded for demo)
    const adminEmails = ['admin@borewell.com', 'niketpatelrjt6@gmail.com'];
    const role = adminEmails.includes(email) ? 'admin' : 'user';

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user with role
    const user = new User({ name, email, password, phone, role });
    await user.save();

    console.log(`✅ ${role.toUpperCase()} REGISTERED:`, user.name);

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: `Account created as ${role.toUpperCase()}!`,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('❌ REGISTER ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ LOGIN with Role Detection
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`✅ ${user.role.toUpperCase()} LOGGED IN:`, user.name);

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,  // ✅ CRITICAL
      message: `Welcome ${user.role.toUpperCase()} - ${user.name}!`,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });


  } catch (error) {
    console.error('❌ LOGIN ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ ADMIN ONLY - Get all users (ADD THIS)
router.get('/admin/users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await User.find({}, { password: 0 });
    res.json({ users });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
