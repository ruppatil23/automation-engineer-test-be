import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "../src/models/user.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/testdb";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existingUser = await UserModel.findOne({ email: ADMIN_EMAIL });

  if (existingUser) {
    if (existingUser.role === "admin") {
      console.log("? Admin already exists");
      return;
    }

    existingUser.role = "admin";
    await existingUser.save();
    console.log("? Existing user promoted to admin");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  await UserModel.create({
    name: "Admin User",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  });

  console.log("? Admin created");
}

await ensureAdmin();
