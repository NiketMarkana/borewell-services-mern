require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ✅ FIXED: Import routes with error handling
let authRoutes, productRoutes, bookingRoutes;

try {
  authRoutes = require('./routes/auth');
  productRoutes = require('./routes/products');
  bookingRoutes = require('./routes/bookings');
} catch (error) {
  console.error('❌ Missing route files. Create routes/auth.js, routes/products.js, routes/bookings.js');
  process.exit(1);
}

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'API Ready' }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    fix: 'Check if models/ and routes/ folders exist with .js files'
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error - Check .env MONGO_URI:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`));
