const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    rules: {
      type: Object,
      required: true,
    },

    audienceSize: {
      type: Number,
      default: 0,
    },

    messageTemplate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PROCESSING", "COMPLETED"],
      default: "DRAFT",
    },

    scheduledAt: {
      type: Date,
    },

    isScheduled: {
      type: Boolean,
      default: false,
    },

    recommendedChannel: {
      type: String,
      enum: ["EMAIL", "SMS", "WHATSAPP", "RCS"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Campaign", campaignSchema);
