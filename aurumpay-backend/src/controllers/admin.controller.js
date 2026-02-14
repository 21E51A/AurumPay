const pool = require("../config/db");

/* ================= SCHEMES ================= */

exports.createScheme = async (req, res, next) => {
  try {
    const { name, metal_type, total_amount, duration_months, monthly_amount } = req.body;

    await pool.query(
      `INSERT INTO schemes 
       (name, metal_type, total_amount, duration_months, monthly_amount)
       VALUES (?, ?, ?, ?, ?)`,
      [name, metal_type, total_amount, duration_months, monthly_amount]
    );

    res.status(201).json({
      success: true,
      message: "Scheme created successfully"
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
      price_per_gram,
      weight_grams,
      making_charge,
      description,
      image_url
    } = req.body;

    await pool.query(
      `INSERT INTO jewellery
       (name, category, price_per_gram, weight_grams, making_charge, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category, price_per_gram, weight_grams, making_charge, description, image_url]
    );

    res.status(201).json({
      success: true,
      message: "Jewellery added successfully"
    });
  } catch (err) {
    next(err);
  }
};

/* ================= METAL PRICES ================= */

exports.updateMetalPrice = async (req, res, next) => {
  try {
    const { metal_type, price_per_gram } = req.body;

    await pool.query(
      `UPDATE metal_prices
       SET price_per_gram = ?
       WHERE metal_type = ?`,
      [price_per_gram, metal_type]
    );

    res.json({
      success: true,
      message: `${metal_type} price updated`
    });
  } catch (err) {
    next(err);
  }
};
