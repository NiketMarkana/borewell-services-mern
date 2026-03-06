const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/borewell-services')
    .then(async () => {
        const users = await User.find({}).select('email role name');
        console.log('\n--- System Users List ---');
        users.forEach(u => {
            console.log(`- Email: ${u.email} | Role: ${u.role} | Name: ${u.name}`);
        });
        console.log('-------------------------\n');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
