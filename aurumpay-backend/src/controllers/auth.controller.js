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
    // 🔥 Get full result from service (token + user)
    const result = await service.login(req.body);

    // 🔥 Send full object correctly
    res.json(result);

  } catch (e) {
    next(e);
  }
};
