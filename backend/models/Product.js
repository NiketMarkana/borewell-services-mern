const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['HDPE', 'PVC', 'Water Pump'],
    required: true
  },
  subCategory: {
    type: String,
    enum: ['Borewell Pump', 'Openwell Pump', ''],
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'piece'
  },
  availableUnits: {
    type: [String],
    default: ['piece', 'meter', 'feet', 'kg']
  },
  image: {
    type: String,
    default: ''
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

