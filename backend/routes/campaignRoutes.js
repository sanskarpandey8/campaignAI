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
  "/:campaignId",
  campaignController.getById
);

module.exports = router;