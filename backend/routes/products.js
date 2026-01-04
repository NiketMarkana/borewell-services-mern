const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Seed demo data - run once
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const demoProducts = [
      {
        name: 'Deep Borewell Drilling 300ft Service',
        category: 'borewell',
        description: 'Professional borewell drilling up to 300 feet with guaranteed yield.',
        price: 35000,
        specs: { depth: '300ft', diameter: '6 inch', yield: '5000 LPH' },
        image: 'https://images.unsplash.com/photo-1581092160607-a783…',
        stock: 5
      },
      {
        name: 'HDPE Pipe 4" x 100m PN10',
        category: 'hdpe',
        description: 'High-density polyethylene pipe for borewell casing.',
        price: 5200,
        specs: { size: '4 inch', length: '100m', grade: 'PN10', pressure: '10 bar' },
        image: 'https://images.unsplash.com/photo-1581092160607-a783…',
        stock: 20
      },
      {
        name: 'Submersible Water Pump 2HP',
        category: 'pump',
        description: 'Heavy-duty submersible pump for deep borewells.',
        price: 12500,
        specs: { hp: 2, type: 'submersible', head: '150m', flow: '8000 LPH' },
        image: 'https://images.unsplash.com/photo-1581092160607-a783…',
        stock: 15
      }
    ];
    const products = await Product.insertMany(demoProducts);
    res.json({ message: 'Seeded successfully', products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { category, search } = req.query;
  let query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  
  const products = await Product.find(query);
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

module.exports = router;
