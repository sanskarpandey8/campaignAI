const campaignDao = require("../dao/campaignDao");
const Customer = require("../models/Customer");
const CommunicationLog = require(
  "../models/CommunicationLog"
);
const channelService = require(
  "../services/channelService"
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

      if (rules.city) {
        query.city = rules.city;
      }

      if (rules.preferredChannel) {
        query.preferredChannel =
          rules.preferredChannel;
      }

      if (rules.tags) {
        query.tags = {
          $in: rules.tags,
        };
      }

      if (rules.lastOrderDays) {
        const date = new Date();

        date.setDate(
          date.getDate() -
            rules.lastOrderDays
        );

        query.lastOrderDate = {
          $gte: date,
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
          status: "PROCESSING",
        });

      // Send campaign to all matching customers
      for (const customer of customers) {
        const personalizedMessage =
          messageTemplate.replace(
            "{name}",
            customer.name
          );

        const communication =
          await CommunicationLog.create({
            campaignId: campaign._id,
            customerId: customer._id,
            message:
              personalizedMessage,
            channel:
              customer.preferredChannel,
            status: "CREATED",
          });

        await channelService.sendMessage(
          communication._id
        );
      }

      // Mark campaign as completed
      await campaignDao.updateCampaign(
        campaign._id,
        {
          status: "COMPLETED",
        }
      );

      response.status(201).json({
        message:
          "Campaign created successfully",
        campaign,
        audienceCount:
          customers.length,
      });
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message:
          "Internal server error",
      });
    }
  },

  getAll: async (
    request,
    response
  ) => {
    try {
      const campaigns =
        await campaignDao.getAllCampaigns();

      response
        .status(200)
        .json(campaigns);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message:
          "Internal server error",
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
        return response
          .status(404)
          .json({
            message:
              "Campaign not found",
          });
      }

      response
        .status(200)
        .json(campaign);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message:
          "Internal server error",
      });
    }
  },

  getStats: async (request, response) => {
  try {
    const { campaignId } = request.params;

    const total =
      await CommunicationLog.countDocuments({
        campaignId,
      });

    const delivered =
      await CommunicationLog.countDocuments({
        campaignId,
        status: "DELIVERED",
      });

    const failed =
      await CommunicationLog.countDocuments({
        campaignId,
        status: "FAILED",
      });

    const opened =
      await CommunicationLog.countDocuments({
        campaignId,
        status: "OPENED",
      });

    const read =
      await CommunicationLog.countDocuments({
        campaignId,
        status: "READ",
      });

    const clicked =
      await CommunicationLog.countDocuments({
        campaignId,
        status: "CLICKED",
      });

    response.status(200).json({
      campaignId,
      total,
      delivered,
      failed,
      opened,
      read,
      clicked,
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message: "Internal server error",
    });
  }
},

getLogs: async (request, response) => {
  try {
    const { campaignId } = request.params;

    const logs =
      await CommunicationLog.find({
        campaignId,
      })
        .populate("customerId", "name email")
        .sort({ createdAt: -1 });

    response.status(200).json(logs);
  } catch (error) {
    console.error(error);

    response.status(500).json({
      message: "Internal server error",
    });
  }
},
};

module.exports = campaignController;