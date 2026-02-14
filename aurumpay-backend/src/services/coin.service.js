const pool = require("../config/db");

/**
 * Helper: Calculate final coin price safely
 */
const calculateFinalPrice = (basePrice, discountType, discountVal) => {
  let finalPrice = basePrice;

  if (discountType === "FLAT") {
    finalPrice = basePrice - discountVal;
  }

  if (discountType === "PERCENT") {
    finalPrice = basePrice - (basePrice * discountVal) / 100;
  }

  if (finalPrice < 0) {
    throw new Error("Final price cannot be negative");
  }

  return finalPrice;
};

/**
 * ADMIN: Add new coin
 */
const addCoin = async (data) => {
  const {
    name,
    metal_type,
    weight_grams,
    base_price,
    discount_type,
    discount_value,
  } = data;

  const basePrice = Number(base_price);
  const discountType = discount_type || null;
  const discountVal = Number(discount_value || 0);

  // 🔐 VALIDATIONS
  if (!name || !metal_type || !weight_grams) {
    throw new Error("Missing required coin fields");
  }

  if (basePrice <= 0) {
    throw new Error("Base price must be greater than 0");
  }

  if (discountVal < 0) {
    throw new Error("Discount value cannot be negative");
  }

  if (discountType === "PERCENT" && discountVal > 100) {
    throw new Error("Percent discount cannot exceed 100");
  }

  const finalPrice = calculateFinalPrice(
    basePrice,
    discountType,
    discountVal
  );

  await pool.query(
    `INSERT INTO coins
     (name, metal_type, weight_grams, base_price, discount_type, discount_value, final_price)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      metal_type,
      weight_grams,
      basePrice,
      discountType,
      discountVal,
      finalPrice,
    ]
  );
};

/**
 * ADMIN: View all coins
 */
const getAllCoins = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM coins ORDER BY created_at DESC"
  );
  return rows;
};

/**
 * ADMIN: Update coin price / discount / availability
 */
const updateCoin = async (id, data) => {
  const {
    base_price,
    discount_type,
    discount_value,
    is_available,
  } = data;

  const basePrice = Number(base_price);
  const discountType = discount_type || null;
  const discountVal = Number(discount_value || 0);

  // 🔐 VALIDATIONS
  if (basePrice <= 0) {
    throw new Error("Base price must be greater than 0");
  }

  if (discountVal < 0) {
    throw new Error("Discount value cannot be negative");
  }

  if (discountType === "PERCENT" && discountVal > 100) {
    throw new Error("Percent discount cannot exceed 100");
  }

  const finalPrice = calculateFinalPrice(
    basePrice,
    discountType,
    discountVal
  );

  await pool.query(
    `UPDATE coins
     SET base_price = ?, discount_type = ?, discount_value = ?, final_price = ?, is_available = ?
     WHERE id = ?`,
    [
      basePrice,
      discountType,
      discountVal,
      finalPrice,
      is_available,
      id,
    ]
  );
};

/**
 * USER: View available coins
 */
const getAvailableCoins = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM coins WHERE is_available = true ORDER BY created_at DESC"
  );
  return rows;
};

module.exports = {
  addCoin,
  getAllCoins,
  updateCoin,
  getAvailableCoins,
};
