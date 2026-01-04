const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth'); // Add later
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    const populated = await Booking.findById(booking._id).populate('product user');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/my/:userId', async (req, res) => {
  const bookings = await Booking.find({ user: req.params.userId })
    .populate('product')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('product user');
  res.json(booking);
});

module.exports = router;
