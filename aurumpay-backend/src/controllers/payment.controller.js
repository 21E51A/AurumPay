const paymentService = require("../services/payment.service");

exports.pay = async (req, res, next) => {
  try {
    const { userSchemeId, amount, method } = req.body;
    const result = await paymentService.pay(
      req.user.id,
      userSchemeId,
      amount,
      method
    );
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.history = async (req, res, next) => {
  try {
    const history = await paymentService.history(req.user.id);
    res.json({ success: true, history });
  } catch (err) {
    next(err);
  }
};
