const pool = require("../config/db");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

const signup = async ({ name, email, password, phone }) => {
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) throw new Error("User already exists");

  const passwordHash = await hashPassword(password);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, phone]
  );

  return { id: result.insertId, email };
};

const login = async ({ email, password }) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) throw new Error("Invalid credentials");

  const user = rows[0];
  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) throw new Error("Invalid credentials");

  const token = generateToken({ id: user.id, role: user.role });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

module.exports = { signup, login };
