const pool = require("../config/db");

/* ================= SCHEMES ================= */

exports.createScheme = async (req, res, next) => {
  try {
    const {
      name,
      metal_type,
      total_amount,
      duration_months,
      monthly_amount,
    } = req.body;

    await pool.query(
      `INSERT INTO schemes 
       (name, metal_type, total_amount, duration_months, monthly_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [name, metal_type, total_amount, duration_months, monthly_amount]
    );

    res.status(201).json({
      success: true,
      message: "Scheme created successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= JEWELLERY ================= */

exports.addJewellery = async (req, res, next) => {
  try {
    const {
      name,
      category,
      weight_grams,
      making_charge,
      description,
      image_url,
    } = req.body;

    await pool.query(
      `INSERT INTO jewellery
       (name, category, weight_grams, making_charge, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, category, weight_grams, making_charge, description, image_url]
    );

    res.status(201).json({
      success: true,
      message: "Jewellery added successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= METAL PRICES ================= */

/**
 * Get all metal prices (Admin View)
 */
exports.getMetalPrices = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT metal_type, price_per_gram, market_price, margin, updated_at
       FROM metal_prices`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update metal pricing (Admin Control)
 */
exports.updateMetalPrice = async (req, res, next) => {
  try {
    const { metal_type, price_per_gram, market_price, margin } = req.body;

    await pool.query(
      `UPDATE metal_prices
       SET price_per_gram = ?,
           market_price = ?,
           margin = ?,
           updated_at = NOW()
       WHERE metal_type = ?`,
      [
        price_per_gram || null,
        market_price || null,
        margin || 0,
        metal_type,
      ]
    );

    res.json({
      success: true,
      message: `${metal_type} pricing updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMetalPrices = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT metal_type, price_per_gram, market_price, margin, updated_at
      FROM metal_prices
    `);

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

exports.updateMetalPrice = async (req, res, next) => {
  try {
    const { metal_type, price_per_gram, market_price, margin } =
      req.body;

    await pool.query(
      `UPDATE metal_prices
       SET price_per_gram = ?,
           market_price = ?,
           margin = ?,
           updated_at = NOW()
       WHERE metal_type = ?`,
      [
        price_per_gram || null,
        market_price || null,
        margin || 0,
        metal_type,
      ]
    );

    res.json({
      success: true,
      message: "Metal price updated successfully",
    });
  } catch (err) {
    next(err);
  }
};
