const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const emailToPromote = process.argv[2];

if (!emailToPromote) {
    console.error('Please provide an email address: node promote_employee.js user@example.com');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/borewell-services')
    .then(async () => {
        const user = await User.findOneAndUpdate(
            { email: emailToPromote.toLowerCase() },
            { role: 'employee' },
            { new: true }
        );

        if (user) {
            console.log(`Success! User ${user.email} is now an employee.`);
        } else {
            console.error('User not found.');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
