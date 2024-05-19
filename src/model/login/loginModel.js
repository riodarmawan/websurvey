const mongoose = require('mongoose');
const database = require('../../config/connection');

// Connect to the database
database.mongooseConnect();

// Define the User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String } // Adding the role field to the schema
});

const User = mongoose.model('User', userSchema);

// Function to find users with the 'role' field
async function findUsersWithRole() {
    try {
        const usersWithRole = await User.find({ role: { $exists: true } });
        console.log('Users with role:', usersWithRole);
    } catch (err) {
        console.error('Error finding users with role:', err);
    }
}

// Call the function
findUsersWithRole();
module.exports = {User};