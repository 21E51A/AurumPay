const express = require("express");
const router = express.Router();

const jewelleryController = require("../controllers/jewellery.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * ADMIN ROUTES
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  jewelleryController.addJewellery
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  jewelleryController.getAllJewellery
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  jewelleryController.updateJewelleryStatus
);

/**
 * USER ROUTES
 */
router.get(
  "/available",
  authMiddleware,
  jewelleryController.getAvailableJewellery
);

router.get(
  "/:id/price",
  authMiddleware,
  jewelleryController.calculatePrice
);

module.exports = router;
