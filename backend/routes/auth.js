const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();

// Simple User model (inline - no separate file needed)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,  // Plain text for now (DEMO ONLY)
  phone: String
});
const User = mongoose.model('User', userSchema);

router.post('/register', async (req, res) => {
  try {
    console.log('📥 Register data:', req.body);
    
    const { name, email, password, phone } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // ✅ NO BCRYPT - Save plain password (DEMO)
    const user = new User({ name, email, password, phone });
    await user.save();
    
    console.log('✅ User SAVED:', user.name);

    // JWT Token (fake hash for demo)
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      success: true,
      message: 'Account created successfully!',
      token, 
      user: { id: user._id, name: user.name, email: user.email }
    });
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
