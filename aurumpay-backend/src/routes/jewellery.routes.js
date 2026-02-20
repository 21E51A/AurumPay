const express = require("express");
const router = express.Router();

const jewelleryController = require("../controllers/jewellery.controller");
const upload = require("../middleware/upload.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/* ================= USER ROUTES ================= */

// Public metal price
router.get(
  "/metal-prices/final",
  jewelleryController.getFinalMetalPrices
);

// Available jewellery (User)
router.get(
  "/available",
  authMiddleware,
  jewelleryController.getAvailableJewellery
);

// Price calculation
router.get(
  "/:id/price",
  authMiddleware,
  jewelleryController.calculatePrice
);

/* ================= ADMIN ROUTES ================= */

// Add jewellery
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  upload.single("image"),
  jewelleryController.addJewellery
);

// Get all jewellery
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  jewelleryController.getAllJewellery
);

// Update availability
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  jewelleryController.updateJewelleryStatus
);

// UPDATE jewellery (EDIT FEATURE)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  jewelleryController.updateJewellery
);

// Delete jewellery
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  jewelleryController.deleteJewellery
);

module.exports = router;