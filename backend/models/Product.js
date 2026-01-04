const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ['borewell', 'hdpe', 'pump', 'accessories']
  },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  specs: { 
    type: mongoose.Schema.Types.Mixed, // Flexible for size, HP, grade
    default: {}
  },
  image: { type: String, default: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=No+Image' },
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
