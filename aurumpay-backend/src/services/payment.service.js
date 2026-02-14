const pool = require("../config/db");

/* Make a payment */
exports.pay = async (userId, userSchemeId, amount, method) => {
  const [[userScheme]] = await pool.query(
    "SELECT * FROM user_schemes WHERE id = ? AND user_id = ?",
    [userSchemeId, userId]
  );

  if (!userScheme) {
    throw new Error("Scheme not found for user");
  }

  if (amount > userScheme.remaining_amount) {
    throw new Error("Amount exceeds remaining balance");
  }

  await pool.query(
    `INSERT INTO payments 
     (user_scheme_id, transaction_id, amount, payment_method, payment_status)
     VALUES (?, UUID(), ?, ?, 'SUCCESS')`,
    [userSchemeId, amount, method]
  );

  const remaining = userScheme.remaining_amount - amount;
  const status = remaining === 0 ? "COMPLETED" : "ACTIVE";

  await pool.query(
    `UPDATE user_schemes 
     SET amount_paid = amount_paid + ?, 
         remaining_amount = ?, 
         status = ?
     WHERE id = ?`,
    [amount, remaining, status, userSchemeId]
  );

  return {
    message: "Payment successful",
    remaining_amount: remaining,
    status
  };
};

/* Payment history */
exports.history = async (userId) => {
  const [rows] = await pool.query(
    `SELECT p.*, us.scheme_id
     FROM payments p
     JOIN user_schemes us ON p.user_scheme_id = us.id
     WHERE us.user_id = ?
     ORDER BY p.paid_at DESC`,
    [userId]
  );

  return rows;
};
