const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🌱 Seeding products...');
    await Product.deleteMany({});
    
    const products = [
      { name: 'Borewell 300ft', category: 'borewell', price: 35000, specs: {depth: '300ft'}, image: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Borewell' },
      { name: 'HDPE Pipe 4"', category: 'hdpe', price: 5200, specs: {size: '4"'}, image: 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=HDPE+Pipe' },
      { name: 'Submersible Pump 2HP', category: 'pump', price: 12500, specs: {hp: 2}, image: 'https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Pump' }
    ];
    
    await Product.insertMany(products);
    console.log('✅ 3 Products seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });
