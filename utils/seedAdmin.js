require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);

  const adminEmail = "admin@spotlight.com";
  const adminPassword = "Admin123-SLOT";

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log("⚠ Admin user already exists");
    process.exit(0);
  }

  const password = await bcrypt.hash(adminPassword, 10);

  const admin = await User.create({
    email: adminEmail,
    password,
    displayName: "System Admin",
    roles: ["admin"],
    isVerified: true
  });

  console.log("✔ Admin created:");
  console.log({
    email: adminEmail,
    password: adminPassword
  });

  process.exit(0);
}

createAdmin();