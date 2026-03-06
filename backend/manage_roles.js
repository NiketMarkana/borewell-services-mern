const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const email = process.argv[2];
const role = process.argv[3]; // 'admin', 'employee', or 'user'

if (!email || !role) {
    console.log('Usage: node manage_roles.js <email> <role>');
    console.log('Example: node manage_roles.js test@example.com employee');
    console.log('Roles: admin, employee, user');
    process.exit(1);
}

const validRoles = ['admin', 'employee', 'user'];
if (!validRoles.includes(role.toLowerCase())) {
    console.error(`Invalid role! Choose from: ${validRoles.join(', ')}`);
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/borewell-services')
    .then(async () => {
        const updatedUser = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role: role.toLowerCase() },
            { new: true }
        );

        if (updatedUser) {
            console.log(`\nSuccess!`);
            console.log(`User: ${updatedUser.email}`);
            console.log(`New Role: ${updatedUser.role}`);
            console.log(`\nPlease refresh the browser or re-login for the user.`);
        } else {
            console.error('\nUser not found.');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('\nError connecting to MongoDB:', err.message);
        process.exit(1);
    });
