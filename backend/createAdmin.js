require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createSuperAdmin = async () => {
  try {
    await connectDB();
    
    console.log('\n=== Create Super Admin User ===\n');
    
    const username = await question('Username: ');
    const email = await question('Email: ');
    const password = await question('Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number): ');
    
    // Validate inputs
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    
    if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
      throw new Error('Please provide a valid email');
    }
    
    if (!password || password.length < 8 || !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)) {
      throw new Error('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number');
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: 'super-admin'
    });
    
    console.log('\n✅ Super admin created successfully!');
    console.log(`Username: ${user.username}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}\n`);
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message, '\n');
    rl.close();
    process.exit(1);
  }
};

createSuperAdmin();
