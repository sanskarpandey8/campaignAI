const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    orderAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PLACED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },

    channel: {
      type: String,
      enum: ["EMAIL", "SMS", "WHATSAPP", "RCS"],
      default: "EMAIL",
    },

    items: {
      type: [String],
      default: [],
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
