const axios = require("axios");
const fs = require("fs");
const { BASE_URL } = require("./utils");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function loginAdmin() {
  const res = await axios.post(`${BASE_URL}/api/user/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  const token = res.data.token;
  const userId = res.data.user.id;

  console.log("✅ Admin login successful");

  const envPath = "./postman/env.json";
  const env = JSON.parse(fs.readFileSync(envPath, "utf-8"));

  env.values = env.values.map((v) => {
    if (v.key === "token") v.value = token;
    if (v.key === "adminUserId") v.value = userId;
    return v;
  });

  fs.writeFileSync(envPath, JSON.stringify(env, null, 2));

  console.log("✅ env.json updated (token + adminUserId)");
}

loginAdmin();