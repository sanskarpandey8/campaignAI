const express = require("express");

const customerController = require(
  "../controllers/customerController"
);

const router = express.Router();

router.post("/", customerController.create);

router.get("/", customerController.getAll);

router.get("/:customerId", customerController.getById);

router.put("/:customerId", customerController.update);

router.delete(
  "/:customerId",
  customerController.delete
);

module.exports = router;