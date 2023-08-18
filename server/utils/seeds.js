const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { MONGODB } = require('../config');

// Connect to MongoDB
mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const adminData = {
  username: 'admin',
  password: '123456',
  email: 'admin@gmail.com',
  createdAt: new Date().toISOString(),
  role: 'admin',
};

async function createAdmin() {
  try {
    // Check if admin user already exists
    const admin = await User.findOne({ username: adminData.username });

    if (admin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    adminData.password = hashedPassword;

    // Create the admin user
    const newAdmin = new User(adminData);
    await newAdmin.save();

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
