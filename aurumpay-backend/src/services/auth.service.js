const pool = require("../config/db");
const passwordUtil = require("../utils/password");
const jwtUtil = require("../utils/jwt");

exports.signup = async ({ name, email, password }) => {
  const hash = await passwordUtil.hash(password);

  await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, hash, "USER"] // default role
  );
};

exports.login = async ({ email, password }) => {
  const [[user]] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await passwordUtil.compare(
    password,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwtUtil.sign({
    id: user.id,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
