const express = require("express");

const campaignController = require(
  "../controllers/campaignController"
);

const router = express.Router();

router.post(
  "/",
  campaignController.create
);

router.get(
  "/",
  campaignController.getAll
);

router.get(
  "/:campaignId/stats",
  campaignController.getStats
);

router.get(
  "/:campaignId/logs",
  campaignController.getLogs
);

router.get(
  "/:campaignId/ai-summary",
  campaignController.getAISummary
);

router.get(
  "/:campaignId",
  campaignController.getById
);

module.exports = router;