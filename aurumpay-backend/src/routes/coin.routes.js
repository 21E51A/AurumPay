const express = require("express");
const router = express.Router();

const coinController = require("../controllers/coin.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

/**
 * ADMIN
 */
router.post("/", auth, role("ADMIN"), coinController.addCoin);
router.get("/all", auth, role("ADMIN"), coinController.getAllCoins);
router.put("/:id", auth, role("ADMIN"), coinController.updateCoin);

/**
 * USER
 */
router.get("/available", auth, coinController.getAvailableCoins);

module.exports = router;
