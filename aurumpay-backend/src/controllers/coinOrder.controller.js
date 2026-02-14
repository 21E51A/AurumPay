const coinOrderService = require("../services/coinOrder.service");

/**
 * USER: Create order
 */
const createOrder = async (req, res, next) => {
  try {
    const { coin_id, quantity } = req.body;

    const order = await coinOrderService.createOrder(
      req.user.id,
      coin_id,
      quantity
    );

    res.status(201).json({
      success: true,
      message: "Coin order created",
      order,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * USER: Pay for order
 */
const payOrder = async (req, res, next) => {
  try {
    const { order_id, payment_method } = req.body;

    const payment = await coinOrderService.payOrder(
      req.user.id,
      order_id,
      payment_method
    );

    res.json({
      success: true,
      message: "Payment successful",
      payment,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * USER: My orders
 */
const myOrders = async (req, res, next) => {
  try {
    const orders = await coinOrderService.getUserOrders(req.user.id);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: All orders
 */
const allOrders = async (req, res, next) => {
  try {
    const orders = await coinOrderService.getAllOrders();
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Revenue summary
 */
const revenueSummary = async (req, res, next) => {
  try {
    const summary = await coinOrderService.getRevenueSummary();
    res.json({ success: true, summary });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  payOrder,
  myOrders,
  allOrders,
  revenueSummary,
};
