const mongoose = require("mongoose");

const communicationLogSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    channel: {
      type: String,
      enum: [
        "EMAIL",
        "SMS",
        "WHATSAPP",
        "RCS",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "SENT",
        "DELIVERED",
        "FAILED",
        "OPENED",
        "READ",
        "CLICKED",
      ],
      default: "CREATED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CommunicationLog",
  communicationLogSchema
);