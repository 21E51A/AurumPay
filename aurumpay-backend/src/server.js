require("dotenv").config();
require("./config/env");

const app = require("./app");
const pool = require("./config/db");
const cron = require("node-cron");
const { fetchLivePrices } = require("./services/marketPrice.service");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ MySQL connected successfully");

    // 🔥 RUN IMMEDIATELY WHEN SERVER STARTS
    await fetchLivePrices();

    // 🔥 CRON EVERY 5 MINUTES
    cron.schedule("*/5 * * * *", async () => {
      console.log("🔄 Updating live metal prices...");
      await fetchLivePrices();
    });

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
