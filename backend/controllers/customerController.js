const customerDao = require("../dao/customerDao");

const customerController = {
  create: async (request, response) => {
    try {
      const customerData = request.body;

      const existingCustomer =
        await customerDao.getCustomerByEmail(
          customerData.email
        );

      if (existingCustomer) {
        return response.status(400).json({
          message: "Customer already exists",
        });
      }

      const customer =
        await customerDao.createCustomer(
          customerData
        );

      response.status(201).json({
        message: "Customer created successfully",
        customer,
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
      const customers =
        await customerDao.getAllCustomers();

      response.status(200).json(customers);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

    getById: async (request, response) => {
    try {
      const { customerId } = request.params;

      const customer =
        await customerDao.getCustomerById(
          customerId
        );

      if (!customer) {
        return response.status(404).json({
          message: "Customer not found",
        });
      }

      response.status(200).json(customer);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

  update: async (request, response) => {
    try {
      const { customerId } = request.params;

      const existingCustomer =
        await customerDao.getCustomerById(
          customerId
        );

      if (!existingCustomer) {
        return response.status(404).json({
          message: "Customer not found",
        });
      }

      const updatedCustomer =
        await customerDao.updateCustomer(
          customerId,
          request.body
        );

      response.status(200).json({
        message: "Customer updated successfully",
        customer: updatedCustomer,
      });
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

  delete: async (request, response) => {
    try {
      const { customerId } = request.params;

      const existingCustomer =
        await customerDao.getCustomerById(
          customerId
        );

      if (!existingCustomer) {
        return response.status(404).json({
          message: "Customer not found",
        });
      }

      await customerDao.deleteCustomer(
        customerId
      );

      response.status(200).json({
        message: "Customer deleted successfully",
      });
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = customerController;