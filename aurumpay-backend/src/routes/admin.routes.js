const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

/* ================= SCHEMES ================= */

router.post(
  "/schemes",
  auth,
  role("ADMIN"),
  adminController.createScheme
);

/* ================= JEWELLERY ================= */

router.post(
  "/jewellery",
  auth,
  role("ADMIN"),
  adminController.addJewellery
);

/* ================= METAL PRICES ================= */

/* GET ALL METAL PRICES (Admin View) */
router.get(
  "/prices",
  auth,
  role("ADMIN"),
  adminController.getMetalPrices
);

/* UPDATE METAL PRICE */
router.put(
  "/prices",
  auth,
  role("ADMIN"),
  adminController.updateMetalPrice
);


router.get(
  "/prices",
  auth,
  role("ADMIN"),
  adminController.getMetalPrices
);

router.put(
  "/prices",
  auth,
  role("ADMIN"),
  adminController.updateMetalPrice
);

module.exports = router;
