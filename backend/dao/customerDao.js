const Customer = require("../models/Customer");

const customerDao = {
  createCustomer: async (customerData) => {
    return await Customer.create(customerData);
  },

  getAllCustomers: async () => {
    return await Customer.find().sort({ createdAt: -1 });
  },

  getCustomerById: async (customerId) => {
    return await Customer.findById(customerId);
  },

  getCustomerByEmail: async (email) => {
    return await Customer.findOne({ email });
  },

  updateCustomer: async (customerId, updateData) => {
    return await Customer.findByIdAndUpdate(
      customerId,
      updateData,
      { new: true }
    );
  },

  deleteCustomer: async (customerId) => {
    return await Customer.findByIdAndDelete(customerId);
  },
};

module.exports = customerDao;