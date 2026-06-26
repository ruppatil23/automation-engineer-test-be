import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "../src/models/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/testdb";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@test.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminPass123!";

async function connectDatabase() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}

function getAdminCredentials() {
  return {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  };
}

async function promoteUserToAdmin(user) {
  user.role = "admin";
  await user.save();
  console.log("✅ Existing user promoted to admin:", user.email);
  return user;
}

async function createAdminUser(email, password) {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  const admin = await UserModel.create({
    name: "Admin User",
    email,
    password: hashedPassword,
    role: "admin",
  });
  console.log("✅ Admin created:", email);
  return admin;
}

async function ensureAdmin() {
  const { email, password } = getAdminCredentials();
  console.log("Admin credentials:", { email, password: password ? "*hidden*" : "(none)" });

  await connectDatabase();

  try {
    const adminUser = await UserModel.findOne({ email });
    if (adminUser) {
      return adminUser.role === "admin"
        ? (console.log("✅ Admin already exists:"), adminUser)
        : await promoteUserToAdmin(adminUser);
    }

    return await createAdminUser(email, password);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

try {
  await ensureAdmin();
  process.exit(0);
} catch (error) {
  console.error("Failed to ensure admin:", error);
  process.exit(1);
}