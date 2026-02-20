const express = require("express");
const router = express.Router();

const coinOrderController = require("../controllers/coinOrder.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

/* ===============================
   USER ROUTES
=================================*/

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

/* ===============================
   ADMIN ROUTES
=================================*/

router.get(
  "/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.allOrders
);

router.put(
  "/update-status/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.updateOrderStatus
);

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.revenueSummary
);

router.get(
  "/daily-trend",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.dailyRevenueTrend
);

router.get(
  "/revenue-by-metal",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.revenueByMetal
);

router.get(
  "/monthly-revenue",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.monthlyRevenue
);

router.get(
  "/revenue-report",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.downloadRevenueCSV
);

router.get(
  "/revenue-report-pdf",
  authMiddleware,
  roleMiddleware("ADMIN"),
  coinOrderController.downloadRevenuePDF
);

module.exports = router;
