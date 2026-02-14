const pool = require("../config/db");

/* List all schemes */
exports.list = async () => {
  const [rows] = await pool.query("SELECT * FROM schemes");
  return rows;
};

/* User joins a scheme */
exports.join = async (userId, schemeId) => {
  const [[scheme]] = await pool.query(
    "SELECT * FROM schemes WHERE id = ?",
    [schemeId]
  );

  if (!scheme) {
    throw new Error("Scheme not found");
  }

  await pool.query(
    `INSERT INTO user_schemes 
     (user_id, scheme_id, total_amount, remaining_amount)
     VALUES (?, ?, ?, ?)`,
    [userId, schemeId, scheme.total_amount, scheme.total_amount]
  );

  return {
    message: "Scheme joined successfully",
    scheme: scheme.name
  };
};
