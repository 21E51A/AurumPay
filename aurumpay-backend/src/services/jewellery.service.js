const pool = require("../config/db");

/* ================= ADMIN ================= */

const addJewellery = async (data) => {
  const {
    name,
    category,
    weight_grams,
    making_charge,
    description,
    image_url = null,
  } = data;

  await pool.query(
    `INSERT INTO jewellery
     (name, category, weight_grams, making_charge, description, image_url, is_available)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      category,
      Number(weight_grams),
      Number(making_charge) || 0,
      description || "",
      image_url,
      true,
    ]
  );
};

const getAllJewellery = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM jewellery ORDER BY id DESC"
  );
  return rows;
};

const updateJewelleryStatus = async (id, is_available) => {
  await pool.query(
    "UPDATE jewellery SET is_available=? WHERE id=?",
    [Boolean(is_available), id]
  );
};

const updateJewellery = async (id, data) => {
  const {
    name,
    category,
    weight_grams,
    making_charge,
    description,
  } = data;

  await pool.query(
    `UPDATE jewellery 
     SET name=?, category=?, weight_grams=?, making_charge=?, description=?
     WHERE id=?`,
    [
      name,
      category,
      Number(weight_grams),
      Number(making_charge) || 0,
      description || "",
      id,
    ]
  );
};

const deleteJewellery = async (id) => {
  await pool.query(
    "DELETE FROM jewellery WHERE id=?",
    [id]
  );
};

/* ================= USER ================= */

const getAvailableJewellery = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM jewellery WHERE is_available=true"
  );
  return rows;
};

/* 🔥 SAFE PRICE CALCULATION (NO 500 ERROR) */
const calculateJewelleryPrice = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM jewellery WHERE id=?",
    [id]
  );

  if (!rows.length) {
    return {
      price_per_gram: 0,
      total_price: 0,
    };
  }

  const jewellery = rows[0];

  const [priceRow] = await pool.query(
    `SELECT price_per_gram, market_price, margin 
     FROM metal_prices 
     WHERE metal_type=?`,
    [jewellery.category]
  );

  if (!priceRow.length) {
    return {
      price_per_gram: 0,
      weight_grams: jewellery.weight_grams,
      making_charge: jewellery.making_charge,
      total_price:
        Number(jewellery.making_charge || 0),
    };
  }

  const base =
    Number(priceRow[0].market_price) > 0
      ? Number(priceRow[0].market_price)
      : Number(priceRow[0].price_per_gram);

  const margin = Number(priceRow[0].margin || 0);

  const finalPerGram =
    base + (base * margin) / 100;

  const total =
    finalPerGram *
      Number(jewellery.weight_grams) +
    Number(jewellery.making_charge || 0);

  return {
    price_per_gram: Number(
      finalPerGram.toFixed(2)
    ),
    weight_grams: jewellery.weight_grams,
    making_charge: jewellery.making_charge,
    total_price: Number(total.toFixed(2)),
  };
};

const getFinalMetalPrices = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM metal_prices"
  );
  return rows;
};

module.exports = {
  addJewellery,
  getAllJewellery,
  updateJewelleryStatus,
  updateJewellery,
  deleteJewellery,
  getAvailableJewellery,
  calculateJewelleryPrice,
  getFinalMetalPrices,
};