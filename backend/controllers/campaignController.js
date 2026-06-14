const campaignDao = require("../dao/campaignDao");
const Customer = require("../models/Customer");
const CommunicationLog = require("../models/CommunicationLog");
const channelService = require("../services/channelService");
const aiService = require("../services/aiService");

const campaignController = {
  create: async (request, response) => {
    try {
      const { name, description, rules, messageTemplate, goal, scheduledAt } =
        request.body;

      // Generate AI message if messageTemplate is not provided
      let finalMessage = messageTemplate;

      if (!finalMessage && goal) {
        finalMessage = await aiService.generateMessage(
          JSON.stringify(rules),
          goal,
        );
      }

      if (!finalMessage) {
        return response.status(400).json({
          message: "Provide either messageTemplate or goal",
        });
      }

      // Dynamic audience segmentation
      const query = {};

      // Total Spent Range
      if (rules.totalSpentMin || rules.totalSpentMax) {
        query.totalSpent = {};

        if (rules.totalSpentMin) {
          query.totalSpent.$gte = rules.totalSpentMin;
        }

        if (rules.totalSpentMax) {
          query.totalSpent.$lte = rules.totalSpentMax;
        }
      }

      // Total Orders Range
      if (rules.totalOrdersMin || rules.totalOrdersMax) {
        query.totalOrders = {};

        if (rules.totalOrdersMin) {
          query.totalOrders.$gte = rules.totalOrdersMin;
        }

        if (rules.totalOrdersMax) {
          query.totalOrders.$lte = rules.totalOrdersMax;
        }
      }

      // Age Range
      if (rules.ageMin || rules.ageMax) {
        query.age = {};

        if (rules.ageMin) {
          query.age.$gte = rules.ageMin;
        }

        if (rules.ageMax) {
          query.age.$lte = rules.ageMax;
        }
      }

      // Multiple Cities
      if (rules.cities && rules.cities.length > 0) {
        query.city = {
          $in: rules.cities,
        };
      }

      // Multiple Channels
      if (rules.channels && rules.channels.length > 0) {
        query.preferredChannel = {
          $in: rules.channels,
        };
      }

      // Tags
      if (rules.tags && rules.tags.length > 0) {
        query.tags = {
          $in: rules.tags,
        };
      }

      // Gender
      if (rules.gender) {
        query.gender = rules.gender;
      }

      // Last Order Date
      if (rules.lastOrderDays) {
        const date = new Date();

        date.setDate(date.getDate() - rules.lastOrderDays);

        query.lastOrderDate = {};

        if (rules.lastOrderOperator === "BEFORE") {
          // Customers who DID NOT buy in last N days
          query.lastOrderDate.$lte = date;
        } else {
          // Customers who bought within last N days
          query.lastOrderDate.$gte = date;
        }
      }

      const customers = await Customer.find(query);

      const campaign = await campaignDao.createCampaign({
        name,
        description,
        rules,
        audienceSize: customers.length,
        messageTemplate: finalMessage,
        status: scheduledAt ? "DRAFT" : "PROCESSING",
        scheduledAt,
        isScheduled: !!scheduledAt,
      });

      if (scheduledAt) {
        return response.status(201).json({
          message: "Campaign scheduled successfully",
          campaign,
        });
      }

      // Send campaign to all matching customers
      for (const customer of customers) {
        const personalizedMessage = finalMessage.includes("{name}")
          ? finalMessage.replace("{name}", customer.name)
          : finalMessage;

        const communication = await CommunicationLog.create({
          campaignId: campaign._id,
          customerId: customer._id,
          message: personalizedMessage,
          channel: customer.preferredChannel,
          status: "CREATED",
        });

        await channelService.sendMessage(communication._id);
      }

      // Mark campaign as completed
      await campaignDao.updateCampaign(campaign._id, {
        status: "COMPLETED",
      });

      response.status(201).json({
        message: "Campaign created successfully",
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
      const campaigns = await campaignDao.getAllCampaigns();

      response.status(200).json(campaigns);
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "Internal server error",
      });
    }
  },

  getById: async (request, response) => {
    try {
      const { campaignId } = request.params;

      const campaign = await campaignDao.getCampaignById(campaignId);

      if (!campaign) {
        return response.status(404).json({
          message: "Campaign not found",
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

  getStats: async (request, response) => {
    try {
      const { campaignId } = request.params;

      const total = await CommunicationLog.countDocuments({
        campaignId,
      });

      const delivered = await CommunicationLog.countDocuments({
        campaignId,
        status: "DELIVERED",
      });

      const failed = await CommunicationLog.countDocuments({
        campaignId,
        status: "FAILED",
      });

      const opened = await CommunicationLog.countDocuments({
        campaignId,
        status: "OPENED",
      });

      const read = await CommunicationLog.countDocuments({
        campaignId,
        status: "READ",
      });

      const clicked = await CommunicationLog.countDocuments({
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

      const logs = await CommunicationLog.find({
        campaignId,
      })
        .populate("customerId", "name email")
        .sort({
          createdAt: -1,
        });

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
