const pool = require("../config/db");

exports.profile = async (req, res, next) => {
  try {
    const [schemes] = await pool.query(
      `SELECT us.*, s.name AS scheme_name
       FROM user_schemes us
       JOIN schemes s ON us.scheme_id = s.id
       WHERE us.user_id = ?`,
      [req.user.id]
    );

    res.json({
      success: true,
      user: req.user,
      schemes
    });
  } catch (err) {
    next(err);
  }
};
