const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/borewell-services';

const products = [
  // HDPE
  { name: 'Sprinkler Pipe', category: 'HDPE', description: 'Durable HDPE sprinkler pipe', price: 120, unit: 'meter' },
  { name: 'Coil Pipe', category: 'HDPE', description: 'Flexible HDPE coil pipe', price: 90, unit: 'meter' },
  { name: 'Black Pipe', category: 'HDPE', description: 'Standard HDPE black pipe', price: 80, unit: 'meter' },
  // PVC
  { name: '0.5 to 2 INCH UPVC PIPE', category: 'PVC', description: 'UPVC pipe 0.5 to 2 inch', price: 75, unit: 'meter' },
  { name: 'AGRICULTURAL PVC PIPE', category: 'PVC', description: 'Agricultural grade PVC pipe', price: 70, unit: 'meter' },
  { name: 'PVC PIPE', category: 'PVC', description: 'Standard PVC pipe', price: 65, unit: 'meter' },
  { name: '3-4 INCH PVC PIPE', category: 'PVC', description: 'PVC pipe 3-4 inch', price: 95, unit: 'meter' },
  { name: '1 INCH PVC PIPE', category: 'PVC', description: 'PVC pipe 1 inch', price: 60, unit: 'meter' },
  { name: 'AGRICULTURAL PVC ROUND PIPE', category: 'PVC', description: 'Round PVC pipe', price: 85, unit: 'meter' },
  { name: 'HIGH QUALITY AGRICULTURAL PVC PIPE', category: 'PVC', description: 'High quality agricultural PVC pipe', price: 110, unit: 'meter' },
  // Submersible
  { name: '1HP Submersible Pump', category: 'Submersible', description: 'Reliable 1HP submersible pump', price: 8500, unit: 'piece' },
  { name: '1.5HP Submersible Pump', category: 'Submersible', description: 'Powerful 1.5HP pump', price: 9800, unit: 'piece' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');

    // Create or update admin user
    const adminEmail = 'admin@borewell.com';
    const adminData = {
      name: 'Admin',
      email: adminEmail,
      phone: '9999999999',
      password: 'admin123', // Plain text, let model middleware hash it
      role: 'admin'
    };

    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      // Update existing admin to ensure password is correct
      admin.password = adminData.password;
      await admin.save();
      console.log('Admin user updated: admin@borewell.com / admin123');
    } else {
      await User.create(adminData);
      console.log('Admin user created: admin@borewell.com / admin123');
    }

    // Seed products
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded');

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

