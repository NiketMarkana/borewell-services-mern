const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Order = require('./models/Order');
    const User = require('./models/User');

    const user = await User.findOne({ role: 'admin' });

    const tempOrder = new Order({
        type: 'service',
        user: user._id,
        serviceDetails: {
            name: 'Test Name',
            mobile: '1234567890',
            date: new Date(),
            address: 'Test Addr',
            depthFeet: 200,
            images: ['test_base64_string_xyz']
        },
        contact: { mobile: '1234567890', email: user.email },
        status: 'Pending'
    });

    await tempOrder.save();
    console.log('Order created with images length:', tempOrder.serviceDetails.images.length);

    const fetched = await Order.findById(tempOrder._id);
    console.log('Fetched images length:', fetched.serviceDetails.images.length);

    await Order.findByIdAndDelete(tempOrder._id);

    process.exit(0);
}

test().catch(console.error);
