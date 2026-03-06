const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  }
});

const orderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['service', 'product'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // For product orders
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productName: String,
    category: String,
    price: Number,
    quantity: Number,
    unit: String,
    additionalDetails: String
  }],
  // For service orders (borewell)
  serviceDetails: {
    name: String,
    mobile: String,
    date: Date,
    address: String,
    locationDescription: String,
    depthFeet: Number,
    additionalNotes: String,
    images: [{ type: String }]
  },
  contact: {
    mobile: String,
    email: String
  },
  status: {
    type: String,
    required: true
  },
  statusHistory: [statusHistorySchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add initial status to history before saving
orderSchema.pre('save', function (next) {
  if (this.isNew && this.status) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

