import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:8001";

function randomEmail() {
  return `worker_${Date.now()}@test.com`;
}

async function registerWorker() {
  const email = randomEmail();

  const res = await axios.post(`${BASE_URL}/api/user/register`, {
    email,
    password: "Password123!",
    role: "worker",
  });

  console.log("Worker created:", email);
  console.log("Worker ID:", res.data.user.id);
}

await registerWorker();