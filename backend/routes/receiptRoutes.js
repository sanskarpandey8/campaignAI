const express = require("express");

const receiptController = require(
  "../controllers/receiptController"
);

const router = express.Router();

router.post(
  "/",
  receiptController.updateStatus
);

module.exports = router;