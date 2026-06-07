const express = require("express");
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getAllPayments,
  getMyPayments,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

router.post("/create-order", protect, authorize("student"), createPaymentOrder);
router.post("/verify", protect, authorize("student"), verifyPayment);
router.get("/", protect, authorize("admin"), getAllPayments);
router.get("/my", protect, authorize("student"), getMyPayments);

module.exports = router;
