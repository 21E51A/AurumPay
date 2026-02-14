const coinService = require("../services/coin.service");

/**
 * ADMIN: Add coin
 */
const addCoin = async (req, res, next) => {
  try {
    await coinService.addCoin(req.body);
    res.status(201).json({
      success: true,
      message: "Coin added successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: View all coins
 */
const getAllCoins = async (req, res, next) => {
  try {
    const coins = await coinService.getAllCoins();
    res.json({ success: true, coins });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Update coin
 */
const updateCoin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await coinService.updateCoin(id, req.body);
    res.json({ success: true, message: "Coin updated successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * USER: View available coins
 */
const getAvailableCoins = async (req, res, next) => {
  try {
    const coins = await coinService.getAvailableCoins();
    res.json({ success: true, coins });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCoin,
  getAllCoins,
  updateCoin,
  getAvailableCoins,
};
