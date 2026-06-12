const campaignDao = require("../dao/campaignDao");
const Customer = require("../models/Customer");
const CommunicationLog = require(
  "../models/CommunicationLog"
);

const campaignController = {
  create: async (request, response) => {
    try {
      const {
        name,
        description,
        rules,
        messageTemplate,
      } = request.body;

      // Dynamic audience segmentation
      const query = {};

      if (rules.totalSpent) {
        query.totalSpent = {
          $gte: rules.totalSpent,
        };
      }

      if (rules.totalOrders) {
        query.totalOrders = {
          $gte: rules.totalOrders,
        };
      }

      const customers =
        await Customer.find(query);

      const campaign =
        await campaignDao.createCampaign({
          name,
          description,
          rules,
          audienceSize: customers.length,
          messageTemplate,
          status: "COMPLETED",
        });

      // Simulate sending campaign
      for (const customer of customers) {
        const personalizedMessage =
          messageTemplate.replace(
            "{name}",
            customer.name
          );

        await CommunicationLog.create({
          campaignId: campaign._id,
          customerId: customer._id,
          message: personalizedMessage,
          status: "SENT",
        });
      }

      response.status(201).json({
        message:
          "Campaign created successfully",
        campaign,
        audienceCount: customers.length,
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
      const campaigns =
        await campaignDao.getAllCampaigns();

      response.status(200).json(campaigns);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getById: async (
    request,
    response
  ) => {
    try {
      const { campaignId } =
        request.params;

      const campaign =
        await campaignDao.getCampaignById(
          campaignId
        );

      if (!campaign) {
        return response.status(404).json({
          message:
            "Campaign not found",
        });
      }

      response.status(200).json(campaign);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = campaignController;