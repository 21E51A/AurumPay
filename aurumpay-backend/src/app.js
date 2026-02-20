const express = require("express");
const cors = require("cors");
const path = require("path");

const coinRoutes = require("./routes/coin.routes");
const coinOrderRoutes = require("./routes/coinOrder.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const jewelleryRoutes = require("./routes/jewellery.routes");
const schemeRoutes = require("./routes/scheme.routes");
const paymentRoutes = require("./routes/payment.routes");

const errorHandler = require("./middleware/error.middleware");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= STATIC FILES ================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "AurumPay Backend Running 🚀",
  });
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jewellery", jewelleryRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coins", coinRoutes);
app.use("/api/coin-orders", coinOrderRoutes);

/* ================= ERROR HANDLER ================= */

app.use(errorHandler);

module.exports = app;
