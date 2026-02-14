require("dotenv").config();
require("./config/env");

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // 🔥 Test DB connection
    await pool.query("SELECT 1");
    console.log("✅ MySQL connected successfully");

    app.listen(PORT, () => {
      console.log(`🔥 AurumPay backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MySQL connection failed");
    console.error(err.message);
    process.exit(1);
  }
}

startServer();
