const pool = require("../config/db");
const password = require("../utils/password");
const jwtUtil = require("../utils/jwt");

exports.signup = async ({ name, email, password: pwd }) => {
  const hash = await password.hash(pwd);
  await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, hash]
  );
};

exports.login = async ({ email, password: pwd }) => {
  const [[user]] = await pool.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );

  if (!user || !(await password.compare(pwd, user.password_hash)))
    throw new Error("Invalid credentials");

  return jwtUtil.sign({ id: user.id, role: user.role });
};
