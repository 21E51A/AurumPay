const axios = require("axios");
const pool = require("../config/db");

/* =========================================
   FETCH LIVE INDIAN GOLD & SILVER PRICES
========================================= */

async function fetchLivePrices() {
  try {
    console.log("🇮🇳 Fetching Indian live gold & silver price...");

    if (!process.env.GOLD_API_KEY) {
      console.error("❌ GOLD_API_KEY not found in .env");
      return;
    }

    const headers = {
      "x-access-token": process.env.GOLD_API_KEY,
      "Content-Type": "application/json",
    };

    /* ================= GOLD ================= */

    const goldRes = await axios.get(
      "https://www.goldapi.io/api/XAU/INR",
      { headers }
    );

    console.log("Gold API Response:", goldRes.data);

    if (!goldRes.data || !goldRes.data.price) {
      console.error("❌ Invalid Gold API response");
      return;
    }

    /* ================= SILVER ================= */

    const silverRes = await axios.get(
      "https://www.goldapi.io/api/XAG/INR",
      { headers }
    );

    console.log("Silver API Response:", silverRes.data);

    if (!silverRes.data || !silverRes.data.price) {
      console.error("❌ Invalid Silver API response");
      return;
    }

    /* ================= CONVERSION ================= */

    const goldPerOunce = goldRes.data.price;
    const silverPerOunce = silverRes.data.price;

    // 1 Ounce = 31.1035 grams
    const goldPerGram = goldPerOunce / 31.1035;
    const silverPerGram = silverPerOunce / 31.1035;

    const goldFinal = Number(goldPerGram.toFixed(2));
    const silverFinal = Number(silverPerGram.toFixed(2));

    console.log("Converted Gold (INR/gram):", goldFinal);
    console.log("Converted Silver (INR/gram):", silverFinal);

    /* ================= DATABASE UPDATE ================= */

    await pool.query(
      `UPDATE metal_prices
       SET market_price = ?, updated_at = NOW()
       WHERE metal_type = 'GOLD'`,
      [goldFinal]
    );

    await pool.query(
      `UPDATE metal_prices
       SET market_price = ?, updated_at = NOW()
       WHERE metal_type = 'SILVER'`,
      [silverFinal]
    );

    console.log("✅ Indian market prices updated successfully\n");

  } catch (err) {
    console.error("❌ Indian price fetch failed:", err.response?.data || err.message);
  }
}

module.exports = { fetchLivePrices };
