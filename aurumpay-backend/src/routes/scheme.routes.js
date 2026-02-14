const express = require("express");
const router = express.Router();

const schemeController = require("../controllers/scheme.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", schemeController.list);
router.post("/join", authMiddleware, schemeController.join);

module.exports = router;
