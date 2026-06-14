const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    preferredChannel: {
      type: String,
      enum: ["EMAIL", "SMS", "WHATSAPP", "RCS"],
      default: "EMAIL",
    },

    tags: {
      type: [String],
      default: [],
    },

    lastOrderDate: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
    },

    age: {
      type: Number,
    },

    lifetimeValue: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Customer", customerSchema);
