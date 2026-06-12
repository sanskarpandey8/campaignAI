const Order = require("../models/Order");

const orderDao = {
  createOrder: async (orderData) => {
    return await Order.create(orderData);
  },

  getAllOrders: async () => {
    return await Order.find()
      .populate("customerId")
      .sort({ createdAt: -1 });
  },

  getOrderById: async (orderId) => {
    return await Order.findById(orderId).populate(
      "customerId"
    );
  },

  getOrdersByCustomer: async (customerId) => {
    return await Order.find({ customerId }).sort({
      createdAt: -1,
    });
  },
};

module.exports = orderDao;