const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { protect, admin, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/orders
// @desc    Get all orders (admin/employee only) with optional status/type filters
// @access  Private/Admin/Employee
router.get('/orders', protect, authorize('admin', 'employee'), async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    // If requester is an employee, restrict to their assigned departments
    if (req.user.role === 'employee') {
      const depts = req.user.departments || [];
      const conditions = [];

      if (depts.includes('Borewell Services')) {
        conditions.push({ type: 'service' });
      }

      // Produc categories: HDPE, PVC, Water Pump
      const prodCategories = depts.filter(d => ['HDPE', 'PVC', 'Water Pump'].includes(d));
      if (prodCategories.length > 0) {
        conditions.push({
          type: 'product',
          'items.category': { $in: prodCategories }
        });
      }

      if (conditions.length > 0) {
        query.$or = conditions;
      } else {
        // If employee has no departments, they can't see anything
        query._id = null;
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone role')
        .populate('items.product', 'name category price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(query)
    ]);

    res.json({
      data: orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status (admin/employee only)
// @access  Private/Admin/Employee
router.put(
  '/orders/:id/status',
  protect,
  authorize('admin', 'employee'),
  [
    body('status').notEmpty().withMessage('Status is required'),
    body('note').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status, note } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if employee has permission to update this order
      if (req.user.role === 'employee') {
        const depts = req.user.departments || [];
        let hasAccess = false;

        if (order.type === 'service' && depts.includes('Borewell Services')) {
          hasAccess = true;
        } else if (order.type === 'product') {
          // If any item category matches employee departments
          hasAccess = order.items.some(item => depts.includes(item.category));
        }

        if (!hasAccess) {
          return res.status(403).json({ message: 'Access denied: You are not authorized to manage this order category' });
        }
      }

      // Validate status based on order type
      const serviceStatuses = ['Approved', 'In Process', 'Cancelled', 'Completed', 'Pending'];
      const productStatuses = ['Pending', 'Approved', 'Processing', 'Shipped/Dispatched', 'Delivered', 'Cancelled'];

      const allowed = order.type === 'service' ? serviceStatuses : productStatuses;
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: 'Invalid status for this order type' });
      }

      order.status = status;
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || ''
      });

      await order.save();

      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'name email phone')
        .populate('items.product', 'name category price');

      res.json(populatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

const User = require('../models/User');

// @route   GET /api/admin/employees
// @desc    Get all employees (admin only)
// @access  Private/Admin
router.get('/employees', protect, admin, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password');
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/employees
// @desc    Add a new employee (admin only)
// @access  Private/Admin
router.post(
  '/employees',
  protect,
  admin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('address').optional().isString()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, password, address } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const employee = await User.create({
        name,
        email,
        phone,
        password,
        address,
        role: 'employee',
        departments: req.body.departments || []
      });

      const employeeData = employee.toObject();
      delete employeeData.password;

      res.status(201).json(employeeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/admin/employees/:id
// @desc    Delete an employee (admin only)
// @access  Private/Admin
router.delete('/employees/:id', protect, admin, async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.role !== 'employee') {
      return res.status(400).json({ message: 'Only employees can be deleted using this route' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/employees/:id
// @desc    Update employee details (admin only)
// @access  Private/Admin
router.put(
  '/employees/:id',
  protect,
  admin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, address, departments } = req.body;
      const employee = await User.findById(req.params.id);

      if (!employee || employee.role !== 'employee') {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Check if email is already taken by another user
      if (email !== employee.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use by another user' });
        }
      }

      employee.name = name;
      employee.email = email;
      employee.phone = phone;
      employee.address = address;
      if (departments) employee.departments = departments;

      await employee.save();

      const employeeData = employee.toObject();
      delete employeeData.password;

      res.json(employeeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

