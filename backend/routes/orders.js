const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders/service
// @desc    Create borewell service order
// @access  Private
router.post('/service', protect, [
  body('serviceDetails.name').notEmpty().withMessage('Name is required'),
  body('serviceDetails.mobile').notEmpty().withMessage('Mobile number is required'),
  body('serviceDetails.date').notEmpty().withMessage('Date is required'),
  body('serviceDetails.address').notEmpty().withMessage('Address is required'),
  body('serviceDetails.depthFeet').isNumeric().withMessage('Depth must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceDetails, contact } = req.body;

    const order = await Order.create({
      type: 'service',
      user: req.user._id,
      serviceDetails: {
        ...serviceDetails,
        date: new Date(serviceDetails.date)
      },
      contact: contact || {
        mobile: serviceDetails.mobile,
        email: req.user.email
      },
      status: 'Pending'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .select('-password');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/orders/product
// @desc    Create product order
// @access  Private
router.post('/product', protect, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('contact.mobile').notEmpty().withMessage('Mobile number is required'),
  body('contact.email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, contact } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const order = await Order.create({
      type: 'product',
      user: req.user._id,
      items,
      contact,
      status: 'Pending',
      totalAmount
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name category price')
      .select('-password');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('user', 'name email phone')
      .populate('items.product', 'name category price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name category price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order (User can delete own cancelled order)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check status (only allow deleting if Pending, Cancelled or Rejected)
    const canDelete = ['Pending', 'Cancelled', 'Rejected'].includes(order.status);
    if (!canDelete && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Can only delete Pending or Cancelled orders' });
    }

    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

