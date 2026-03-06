const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products or filter by category
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, all } = req.query;
    let query = category ? { category } : {};

    // If 'all' is not true, only show available products
    if (all !== 'true') {
      query.isAvailable = { $ne: false };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const { protect, admin } = require('../middleware/auth');

// @route   POST /api/products
// @desc    Create a product (admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, category, subCategory, description, price, unit, image } = req.body;

    const product = new Product({
      name,
      category,
      subCategory,
      description,
      price,
      unit,
      image,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, category, subCategory, description, price, unit, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.category = category || product.category;
      product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.unit = unit || product.unit;
      product.image = image || product.image;
      product.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : product.isAvailable;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

