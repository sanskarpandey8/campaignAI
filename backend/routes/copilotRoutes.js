const express = require("express");
const copilotController = require(
  "../controllers/copilotController"
);

const router = express.Router();

router.post(
  "/generate",
  copilotController.generate
);

router.post(
  "/launch",
  copilotController.launch
);

module.exports = router;