import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from '../src/models/user.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shift-manager';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');

  const email = process.env.ADMIN_EMAIL || 'admin@test.com';
  const password = process.env.ADMIN_PASSWORD || 'AdminPass123!';

  const exists = await UserModel.findOne({ email });
  if (exists) {
    if (exists.role === 'admin') {
      console.log('Admin user already exists:', email);
      process.exit(0);
    }
    exists.role = 'admin';
    await exists.save();
    console.log('Promoted existing user to admin:', email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = new UserModel({ name: 'Admin', email, password: hashed, role: 'admin' });
  await user.save();
  console.log('Created admin user:', email);
  console.log('Admin password:', password);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
