const orderDao = require("../dao/orderDao");
const customerDao = require("../dao/customerDao");

const orderController = {
  create: async (request, response) => {
    try {
      const orderData = request.body;

      const customer =
        await customerDao.getCustomerById(
          orderData.customerId
        );

      if (!customer) {
        return response.status(404).json({
          message: "Customer not found",
        });
      }

      const order = await orderDao.createOrder(
        orderData
      );

      await customerDao.updateCustomer(
        customer._id,
        {
          totalSpent:
            customer.totalSpent +
            order.orderAmount,

          totalOrders:
            customer.totalOrders + 1,

          lastOrderDate: new Date(),
        }
      );

      response.status(201).json({
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getAll: async (request, response) => {
    try {
      const orders =
        await orderDao.getAllOrders();

      response.status(200).json(orders);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getByCustomer: async (
    request,
    response
  ) => {
    try {
      const { customerId } =
        request.params;

      const orders =
        await orderDao.getOrdersByCustomer(
          customerId
        );

      response.status(200).json(orders);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = orderController;