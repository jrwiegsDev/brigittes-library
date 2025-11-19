require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const updateUsername = async (email, newUsername) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Find and update user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.email}`);
    console.log(`Current username: ${user.username}`);
    
    user.username = newUsername;
    await user.save();
    
    console.log(`✅ Username updated to: ${newUsername}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Get email and new username from command line
const email = process.argv[2];
const newUsername = process.argv[3];

if (!email || !newUsername) {
  console.log('Usage: node updateUsername.js <email> <new-username>');
  console.log('Example: node updateUsername.js jrwiegs@gmail.com Joe');
  process.exit(1);
}

updateUsername(email, newUsername);
