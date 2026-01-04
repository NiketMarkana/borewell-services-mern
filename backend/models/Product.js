const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['borewell', 'hdpe', 'pump', 'accessories'] },
  description: String,
  price: { type: Number, required: true, min: 0 },
  specs: { type: Object, default: {} },
  image: String,
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
