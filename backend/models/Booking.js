const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  serviceType: { type: String, enum: ['drilling', 'installation', 'repair', 'maintenance'], required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'assigned', 'completed'], default: 'pending' },
  address: { type: String, required: true },
  phone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
