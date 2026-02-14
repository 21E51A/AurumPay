const jewelleryService = require("../services/jewellery.service");

/**
 * ADMIN: Add jewellery
 */
const addJewellery = async (req, res, next) => {
  try {
    await jewelleryService.addJewellery(req.body);
    res.status(201).json({
      success: true,
      message: "Jewellery added successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: View all jewellery
 */
const getAllJewellery = async (req, res, next) => {
  try {
    const jewellery = await jewelleryService.getAllJewellery();
    res.json({ success: true, jewellery });
  } catch (err) {
    next(err);
  }
};

/**
 * ADMIN: Enable / Disable jewellery
 */
const updateJewelleryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    await jewelleryService.updateJewelleryStatus(id, is_available);

    res.json({
      success: true,
      message: "Jewellery status updated",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * USER: View available jewellery
 */
const getAvailableJewellery = async (req, res, next) => {
  try {
    const jewellery = await jewelleryService.getAvailableJewellery();
    res.json({ success: true, jewellery });
  } catch (err) {
    next(err);
  }
};

/**
 * USER: Calculate jewellery price
 */
const calculatePrice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const priceDetails =
      await jewelleryService.calculateJewelleryPrice(id);

    res.json({
      success: true,
      price: priceDetails,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addJewellery,
  getAllJewellery,
  updateJewelleryStatus,
  getAvailableJewellery,
  calculatePrice,
};
