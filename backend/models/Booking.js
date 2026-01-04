const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  serviceType: { 
    type: String, 
    enum: ['drilling', 'installation', 'repair', 'maintenance'],
    required: true
  },
  date: { type: Date, required: true },
  time: String,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: String,
  technician: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

bookingSchema.index({ user: 1, status: 1 });
module.exports = mongoose.model('Booking', bookingSchema);
