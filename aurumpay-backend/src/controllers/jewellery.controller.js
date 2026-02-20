const jewelleryService = require("../services/jewellery.service");

/* ================= ADMIN ================= */

const addJewellery = async (req, res, next) => {
  try {
    const {
      name,
      category,
      weight_grams,
      making_charge,
      description,
    } = req.body;

    if (!name || !category || !weight_grams) {
      return res.status(400).json({
        success: false,
        message: "Name, category and weight are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image or video is required",
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    await jewelleryService.addJewellery({
      name,
      category,
      weight_grams,
      making_charge,
      description,
      image_url: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Jewellery added successfully",
    });
  } catch (err) {
    next(err);
  }
};

const getAllJewellery = async (req, res, next) => {
  try {
    const jewellery = await jewelleryService.getAllJewellery();
    res.json({ success: true, jewellery });
  } catch (err) {
    next(err);
  }
};

const updateJewelleryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;

    await jewelleryService.updateJewelleryStatus(
      id,
      is_available
    );

    res.json({
      success: true,
      message: "Jewellery status updated",
    });
  } catch (err) {
    next(err);
  }
};

const updateJewellery = async (req, res, next) => {
  try {
    const { id } = req.params;

    await jewelleryService.updateJewellery(
      id,
      req.body
    );

    res.json({
      success: true,
      message: "Jewellery updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

const deleteJewellery = async (req, res, next) => {
  try {
    const { id } = req.params;

    await jewelleryService.deleteJewellery(id);

    res.json({
      success: true,
      message: "Jewellery deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/* ================= USER ================= */

const getAvailableJewellery = async (req, res, next) => {
  try {
    const jewellery =
      await jewelleryService.getAvailableJewellery();

    res.json({ success: true, jewellery });
  } catch (err) {
    next(err);
  }
};

const calculatePrice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const price =
      await jewelleryService.calculateJewelleryPrice(id);

    res.json({ success: true, price });
  } catch (err) {
    next(err);
  }
};

const getFinalMetalPrices = async (req, res, next) => {
  try {
    const prices =
      await jewelleryService.getFinalMetalPrices();

    res.json({ success: true, prices });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addJewellery,
  getAllJewellery,
  updateJewelleryStatus,
  updateJewellery,
  deleteJewellery,
  getAvailableJewellery,
  calculatePrice,
  getFinalMetalPrices,
};