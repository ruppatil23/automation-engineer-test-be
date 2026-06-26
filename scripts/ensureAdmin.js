import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8001";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function ensureAdmin() {
  try {
    await axios.post(`${BASE_URL}/api/user/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    console.log("✅ Admin already exists");
  } catch (err) {
    console.log("⚠️ Admin not found. Creating...");

    await axios.post(`${BASE_URL}/api/user/register`, {
      name: "Admin User",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("✅ Admin created");
  }
}

await ensureAdmin();