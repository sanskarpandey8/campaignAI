const express = require("express");

const subjectController = require(
  "../controllers/subjectController"
);

const router = express.Router();

router.post(
  "/generate",
  subjectController.generate
);

module.exports = router;