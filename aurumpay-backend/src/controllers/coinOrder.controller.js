const coinOrderService = require("../services/coinOrder.service");
const PDFDocument = require("pdfkit");
const pool = require("../config/db");

/* =================================
   USER CONTROLLERS
================================= */

const createOrder = async (req, res, next) => {
  try {
    const { coin_id, quantity } = req.body;

    const order = await coinOrderService.createOrder(
      req.user.id,
      coin_id,
      quantity
    );

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

const payOrder = async (req, res, next) => {
  try {
    const { order_id, payment_method } = req.body;

    const payment = await coinOrderService.payOrder(
      req.user.id,
      order_id,
      payment_method
    );

    res.json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

const myOrders = async (req, res, next) => {
  try {
    const orders = await coinOrderService.getUserOrders(req.user.id);
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

/* =================================
   ADMIN CONTROLLERS
================================= */

const allOrders = async (req, res, next) => {
  try {
    const orders = await coinOrderService.getAllOrders();
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const result = await coinOrderService.updateOrderStatus(
      id,
      order_status
    );

    res.json({ success: true, result });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   REVENUE SUMMARY (SAFE)
================================= */
const revenueSummary = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const summary = await coinOrderService.getRevenueSummary(
      start || null,
      end || null
    );

    res.json({ success: true, summary });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   DAILY REVENUE TREND (SAFE)
================================= */
const dailyRevenueTrend = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const trend = await coinOrderService.getDailyRevenueTrend(
      start || null,
      end || null
    );

    res.json({ success: true, trend });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   REVENUE BY METAL (SAFE)
================================= */
const revenueByMetal = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const data = await coinOrderService.getRevenueByMetal(
      start || null,
      end || null
    );

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   MONTHLY REVENUE (SAFE)
================================= */
const monthlyRevenue = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const data = await coinOrderService.getMonthlyRevenue(
      start || null,
      end || null
    );

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   DOWNLOAD CSV REPORT
================================= */
const downloadRevenueCSV = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, total_amount, order_status, created_at
      FROM coin_orders
      WHERE order_status = 'PAID'
    `);

    const csv = [
      "OrderID,Amount,Status,Date",
      ...rows.map(
        (r) =>
          `${r.id},${r.total_amount},${r.order_status},${r.created_at}`
      ),
    ].join("\n");

    res.header("Content-Type", "text/csv");
    res.attachment("revenue-report.csv");
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

/* ===============================
   DOWNLOAD PDF REPORT
================================= */
const downloadRevenuePDF = async (req, res, next) => {
  try {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=revenue.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("Revenue Report", { align: "center" });
    doc.moveDown();

    const [rows] = await pool.query(`
      SELECT id, total_amount, created_at
      FROM coin_orders
      WHERE order_status = 'PAID'
    `);

    rows.forEach((r) => {
      doc.text(`Order: ${r.id} | ₹${r.total_amount} | ${r.created_at}`);
    });

    doc.end();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  payOrder,
  myOrders,
  allOrders,
  updateOrderStatus,
  revenueSummary,
  dailyRevenueTrend,
  revenueByMetal,
  monthlyRevenue,
  downloadRevenueCSV,
  downloadRevenuePDF,
};
