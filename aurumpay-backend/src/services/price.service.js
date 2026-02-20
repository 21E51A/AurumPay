const pool = require("../config/db");

/* ================================
   GET FINAL METAL PRICES
================================ */
async function getFinalMetalPrices() {
  const [rows] = await pool.query(`
    SELECT metal_type, price_per_gram, margin_percent, pricing_mode
    FROM metal_prices
  `);

  return rows.map((row) => {
    let finalPrice = Number(row.price_per_gram);

    // If margin exists → add margin
    if (row.margin_percent > 0) {
      finalPrice =
        finalPrice +
        (finalPrice * Number(row.margin_percent)) / 100;
    }

    return {
      metal_type: row.metal_type,
      base_price: Number(row.price_per_gram),
      margin_percent: Number(row.margin_percent),
      pricing_mode: row.pricing_mode,
      final_price: Number(finalPrice.toFixed(2)),
    };
  });
}

/* ================================
   ADMIN UPDATE PRICE
================================ */
async function updateMetalPrice({
  metal_type,
  price_per_gram,
  margin_percent,
  pricing_mode,
}) {
  await pool.query(
    `UPDATE metal_prices
     SET price_per_gram = ?,
         margin_percent = ?,
         pricing_mode = ?
     WHERE metal_type = ?`,
    [price_per_gram, margin_percent, pricing_mode, metal_type]
  );

  return { success: true };
}

module.exports = {
  getFinalMetalPrices,
  updateMetalPrice,
};
