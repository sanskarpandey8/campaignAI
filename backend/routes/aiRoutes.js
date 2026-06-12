const express = require("express");

const aiController = require(
  "../controllers/aiController"
);

const router = express.Router();

router.post(
  "/generate-message",
  aiController.generateMessage
);

module.exports = router;