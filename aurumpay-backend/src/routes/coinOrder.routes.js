const express = require("express");
const router = express.Router();

const coinOrderController = require("../controllers/coinOrder.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/**
 * USER ROUTES
 */
router.post(
  "/create",
  authMiddleware,
  coinOrderController.createOrder
);

router.post(
  "/pay",
  authMiddleware,
  coinOrderController.payOrder
);

router.get(
  "/my",
  authMiddleware,
  coinOrderController.myOrders
);

/**
 * ADMIN ROUTES
 */
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.allOrders
);

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.revenueSummary
);

module.exports = router;
