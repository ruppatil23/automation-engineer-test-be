import axios from "axios";
import fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:8001";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function loginAdmin() {
  const res = await axios.post(`${BASE_URL}/api/user/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  const token = res.data.token;
  const userId = res.data.user.id;
  const adminEmail = ADMIN_EMAIL || "";
  const adminPassword = ADMIN_PASSWORD || "";

  console.log("Admin login successful");

  const envPath = "./postman/env.json";
  let env;

  try {
    env = JSON.parse(fs.readFileSync(envPath, "utf-8"));
  } catch (error) {
    console.warn(`Warning: could not read ${envPath}. Recreating environment file.`);
    env = {
      id: "automation-engineer-test-be-env",
      name: "Automation Engineer Test BE",
      values: [
        { key: "token", value: "", type: "text" },
        { key: "adminUserId", value: "", type: "text" },
      ],
      _postman_variable_scope: "environment",
      _postman_exported_at: new Date().toISOString(),
      _postman_exported_using: "Postman/10.0.0",
    };
  }

  const updatedValues = [
    { key: "adminEmail", value: adminEmail, type: "text" },
    { key: "adminPassword", value: adminPassword, type: "text" },
    { key: "token", value: token, type: "text" },
    { key: "adminUserId", value: userId, type: "text" },
    { key: "baseUrl", value: BASE_URL, type: "text" },
  ];

  const valuesByKey = env.values.reduce((acc, v) => {
    acc[v.key] = v;
    return acc;
  }, {});

  updatedValues.forEach((updated) => {
    valuesByKey[updated.key] = valuesByKey[updated.key] || updated;
    valuesByKey[updated.key].value = updated.value;
  });

  env.values = Object.values(valuesByKey);
  fs.writeFileSync(envPath, JSON.stringify(env, null, 2));

  console.log("env.json updated");
}

await loginAdmin();