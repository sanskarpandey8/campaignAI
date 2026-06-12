const express = require("express");

const statsController = require(
  "../controllers/statsController"
);

const router = express.Router();

router.get(
  "/communications",
  statsController.getStats
);

module.exports = router;
