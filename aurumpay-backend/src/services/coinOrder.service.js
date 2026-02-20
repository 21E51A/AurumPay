const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/* =================================
   USER: Create Order
================================= */
async function createOrder(userId, coinId, quantity) {
  const qty = Number(quantity || 1);

  const [coins] = await pool.query(
    "SELECT * FROM coins WHERE id = ? AND is_available = true",
    [coinId]
  );

  if (!coins.length) throw new Error("Coin not available");

  const coin = coins[0];

  if (coin.stock < qty) {
    throw new Error("Insufficient stock");
  }

  const totalAmount = Number(coin.final_price) * qty;

  const [result] = await pool.query(
    `INSERT INTO coin_orders
     (user_id, coin_id, quantity, price_per_coin, total_amount, order_status)
     VALUES (?, ?, ?, ?, ?, 'PENDING')`,
    [userId, coinId, qty, coin.final_price, totalAmount]
  );

  return {
    order_id: result.insertId,
    total_amount: totalAmount,
  };
}

/* =================================
   USER: Pay Order
================================= */
async function payOrder(userId, orderId, paymentMethod) {
  const [orders] = await pool.query(
    "SELECT * FROM coin_orders WHERE id = ? AND user_id = ?",
    [orderId, userId]
  );

  if (!orders.length) throw new Error("Order not found");

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

  await pool.query(
    "UPDATE coins SET stock = stock - ? WHERE id = ?",
    [order.quantity, order.coin_id]
  );

  return {
    transaction_id: transactionId,
    status: "PAID",
  };
}

/* =================================
   USER: Get My Orders
================================= */
async function getUserOrders(userId) {
  const [rows] = await pool.query(
    `SELECT co.*, c.name AS coin_name
     FROM coin_orders co
     JOIN coins c ON c.id = co.coin_id
     WHERE co.user_id = ?
     ORDER BY co.created_at DESC`,
    [userId]
  );

  return rows;
}

/* =================================
   ADMIN: Get All Orders
================================= */
async function getAllOrders() {
  const [rows] = await pool.query(`
    SELECT co.*, 
           u.name AS user_name,
           c.name AS coin_name
    FROM coin_orders co
    JOIN users u ON u.id = co.user_id
    JOIN coins c ON c.id = co.coin_id
    ORDER BY co.created_at DESC
  `);

  return rows;
}

/* =================================
   ADMIN: Revenue Summary
================================= */
async function getRevenueSummary(startDate, endDate) {
  let query = `
    SELECT
      COUNT(*) AS total_orders,
      SUM(CASE WHEN order_status = 'PAID' THEN 1 ELSE 0 END) AS paid_orders,
      SUM(CASE WHEN order_status = 'PAID' THEN total_amount ELSE 0 END) AS total_revenue,
      SUM(CASE WHEN order_status = 'PAID' THEN quantity ELSE 0 END) AS coins_sold
    FROM coin_orders
    WHERE 1=1
  `;

  const params = [];

  if (startDate && endDate) {
    query += " AND DATE(created_at) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  const [[summary]] = await pool.query(query, params);

  return {
    total_orders: Number(summary.total_orders || 0),
    paid_orders: Number(summary.paid_orders || 0),
    total_revenue: Number(summary.total_revenue || 0),
    coins_sold: Number(summary.coins_sold || 0),
  };
}

/* =================================
   ADMIN: Daily Revenue Trend
================================= */
async function getDailyRevenueTrend(startDate, endDate) {
  let query = `
    SELECT DATE(created_at) AS date,
           SUM(total_amount) AS revenue
    FROM coin_orders
    WHERE order_status = 'PAID'
  `;

  const params = [];

  if (startDate && endDate) {
    query += " AND DATE(created_at) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  query += " GROUP BY DATE(created_at) ORDER BY DATE(created_at)";

  const [rows] = await pool.query(query, params);

  return rows.map(r => ({
    date: r.date,
    revenue: Number(r.revenue || 0),
  }));
}

/* =================================
   ADMIN: Revenue By Metal
================================= */
async function getRevenueByMetal(startDate, endDate) {
  let query = `
    SELECT c.metal_type,
           SUM(co.total_amount) AS revenue
    FROM coin_orders co
    JOIN coins c ON c.id = co.coin_id
    WHERE co.order_status = 'PAID'
  `;

  const params = [];

  if (startDate && endDate) {
    query += " AND DATE(co.created_at) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  query += " GROUP BY c.metal_type";

  const [rows] = await pool.query(query, params);

  return rows.map(r => ({
    metal_type: r.metal_type,
    revenue: Number(r.revenue || 0),
  }));
}

/* =================================
   ADMIN: Monthly Revenue
================================= */
async function getMonthlyRevenue(startDate, endDate) {
  let query = `
    SELECT DATE_FORMAT(created_at, '%Y-%m') AS month_key,
           SUM(total_amount) AS revenue
    FROM coin_orders
    WHERE order_status = 'PAID'
  `;

  const params = [];

  if (startDate && endDate) {
    query += " AND DATE(created_at) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  query += " GROUP BY month_key ORDER BY month_key";

  const [rows] = await pool.query(query, params);

  return rows.map(r => ({
    month: r.month_key,
    revenue: Number(r.revenue || 0),
  }));
}

module.exports = {
  createOrder,
  payOrder,
  getUserOrders,
  getAllOrders,
  getRevenueSummary,
  getDailyRevenueTrend,
  getRevenueByMetal,
  getMonthlyRevenue,
};
