const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/**
 * USER: Create coin order
 */
const createOrder = async (userId, coinId, quantity) => {
  const qty = Number(quantity || 1);

  const [coins] = await pool.query(
    "SELECT * FROM coins WHERE id = ? AND is_available = true",
    [coinId]
  );

  if (coins.length === 0) {
    throw new Error("Coin not available");
  }

  const coin = coins[0];
  const pricePerCoin = Number(coin.final_price);
  const totalAmount = pricePerCoin * qty;

  const [result] = await pool.query(
    `INSERT INTO coin_orders
     (user_id, coin_id, quantity, price_per_coin, total_amount)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, coinId, qty, pricePerCoin, totalAmount]
  );

  return {
    order_id: result.insertId,
    price_per_coin: pricePerCoin,
    total_amount: totalAmount,
  };
};

/**
 * USER: Pay for order
 */
const payOrder = async (userId, orderId, paymentMethod) => {
  const [orders] = await pool.query(
    "SELECT * FROM coin_orders WHERE id = ? AND user_id = ?",
    [orderId, userId]
  );

  if (orders.length === 0) {
    throw new Error("Order not found");
  }

  const order = orders[0];

  if (order.order_status !== "PENDING") {
    throw new Error("Order already processed");
  }

  const transactionId = uuidv4();

  await pool.query(
    `INSERT INTO coin_payments
     (order_id, transaction_id, payment_method, payment_status)
     VALUES (?, ?, ?, 'SUCCESS')`,
    [orderId, transactionId, paymentMethod]
  );

  await pool.query(
    "UPDATE coin_orders SET order_status = 'PAID' WHERE id = ?",
    [orderId]
  );

  return {
    transaction_id: transactionId,
    total_amount: order.total_amount,
    status: "PAID",
  };
};

/**
 * USER: View my orders
 */
const getUserOrders = async (userId) => {
  const [rows] = await pool.query(
    `SELECT co.*, c.name AS coin_name
     FROM coin_orders co
     JOIN coins c ON c.id = co.coin_id
     WHERE co.user_id = ?`,
    [userId]
  );

  return rows;
};

/**
 * ADMIN: View all orders
 */
const getAllOrders = async () => {
  const [rows] = await pool.query(
    `SELECT co.*, u.name AS user_name, c.name AS coin_name
     FROM coin_orders co
     JOIN users u ON u.id = co.user_id
     JOIN coins c ON c.id = co.coin_id`
  );

  return rows;
};

/**
 * ADMIN: Revenue summary
 */
const getRevenueSummary = async () => {
  const [[row]] = await pool.query(`
    SELECT
      COUNT(*) AS total_orders,
      SUM(order_status = 'PAID') AS paid_orders,
      SUM(CASE WHEN order_status = 'PAID' THEN total_amount ELSE 0 END) AS total_revenue,
      SUM(CASE WHEN order_status = 'PAID' THEN quantity ELSE 0 END) AS coins_sold
    FROM coin_orders
  `);

  return {
    total_orders: Number(row.total_orders || 0),
    paid_orders: Number(row.paid_orders || 0),
    total_revenue: Number(row.total_revenue || 0),
    coins_sold: Number(row.coins_sold || 0),
  };
};

module.exports = {
  createOrder,
  payOrder,
  getUserOrders,
  getAllOrders,
  getRevenueSummary,
};
