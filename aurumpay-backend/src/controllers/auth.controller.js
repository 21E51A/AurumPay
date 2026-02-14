const service = require("../services/auth.service");

exports.signup = async (req, res, next) => {
  try {
    await service.signup(req.body);
    res.json({ message: "Signup success" });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await service.login(req.body);
    res.json({ token });
  } catch (e) {
    next(e);
  }
};
