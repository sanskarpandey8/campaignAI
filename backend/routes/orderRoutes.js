const express = require("express");

const orderController = require(
  "../controllers/orderController"
);

const router = express.Router();

router.post("/", orderController.create);

router.get("/", orderController.getAll);

router.get(
  "/customer/:customerId",
  orderController.getByCustomer
);

module.exports = router;