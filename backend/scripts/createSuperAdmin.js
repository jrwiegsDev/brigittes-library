const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Simple User schema (matching your model)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super-admin'], default: 'admin' }
});

const User = mongoose.model('User', userSchema);

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing super admin if exists
    await User.deleteMany({ email: 'jrwiegs@gmail.com' });
    console.log('Cleared existing user with this email');

    // Get password from command line argument
    const password = process.argv[2];
    
    if (!password) {
      console.error('Please provide a password as argument');
      console.log('Usage: node scripts/createSuperAdmin.js YOUR_PASSWORD');
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new super admin
    const superAdmin = await User.create({
      username: 'jrwiegs',
      email: 'jrwiegs@gmail.com',
      password: hashedPassword,
      role: 'super-admin'
    });

    console.log('\n✅ Super admin created successfully!');
    console.log('Email:', superAdmin.email);
    console.log('Username:', superAdmin.username);
    console.log('Role:', superAdmin.role);
    console.log('\nYou can now login with:');
    console.log('Email: jrwiegs@gmail.com');
    console.log('Password:', password);

    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();
