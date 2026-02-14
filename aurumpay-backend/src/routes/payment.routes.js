const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, paymentController.pay);
router.get("/history", authMiddleware, paymentController.history);

module.exports = router;
