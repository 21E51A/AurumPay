const pool = require("../config/db");

/**
 * ADMIN: Add jewellery
 */
const addJewellery = async (data) => {
  const {
    name,
    category,
    price_per_gram,
    weight_grams,
    making_charge,
    description,
    image_url,
  } = data;

  await pool.query(
    `INSERT INTO jewellery 
    (name, category, price_per_gram, weight_grams, making_charge, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      category,
      price_per_gram,
      weight_grams,
      making_charge,
      description,
      image_url,
    ]
  );
};

/**
 * ADMIN: View all jewellery
 */
const getAllJewellery = async () => {
  const [rows] = await pool.query("SELECT * FROM jewellery");
  return rows;
};

/**
 * ADMIN: Enable / Disable jewellery
 */
const updateJewelleryStatus = async (id, is_available) => {
  await pool.query(
    "UPDATE jewellery SET is_available = ? WHERE id = ?",
    [is_available, id]
  );
};

/**
 * USER: View only available jewellery
 */
const getAvailableJewellery = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM jewellery WHERE is_available = true"
  );
  return rows;
};

/**
 * USER: Calculate jewellery final price
 */
const calculateJewelleryPrice = async (jewelleryId) => {
  const [rows] = await pool.query(
    `SELECT price_per_gram, weight_grams, making_charge
     FROM jewellery
     WHERE id = ? AND is_available = true`,
    [jewelleryId]
  );

  if (rows.length === 0) {
    throw new Error("Jewellery not found or unavailable");
  }

  const { price_per_gram, weight_grams, making_charge } = rows[0];

  const metalPrice = Number(price_per_gram) * Number(weight_grams);
  const finalPrice = metalPrice + Number(making_charge || 0);

  return {
    price_per_gram,
    weight_grams,
    making_charge,
    metalPrice,
    finalPrice,
  };
};

module.exports = {
  addJewellery,
  getAllJewellery,
  updateJewelleryStatus,
  getAvailableJewellery,
  calculateJewelleryPrice,
};
