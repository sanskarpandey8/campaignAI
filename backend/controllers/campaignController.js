const summaryService = require("../services/summaryService");
const Campaign = require(
  "../models/Campaign"
);
const campaignDao = require("../dao/campaignDao");
const Customer = require("../models/Customer");
const CommunicationLog = require("../models/CommunicationLog");
const channelService = require("../services/channelService");

const channelFactory = require(
  "../services/channels/channelFactory"
);

const aiService = require("../services/aiService");

const campaignController = {
  create: async (request, response) => {
    try {
      const { name, description, rules, messageTemplate, goal, scheduledAt } =
        request.body;

      const safeRules = rules || {};

      // Generate AI message if not provided
      let finalMessage = messageTemplate;

      if (!finalMessage && goal) {
        finalMessage = await aiService.generateMessage(
          JSON.stringify(safeRules),
          goal,
        );
      }

      if (!finalMessage) {
        return response.status(400).json({
          message: "Provide either messageTemplate or goal",
        });
      }

      // -------------------------
      // Dynamic Audience Query
      // -------------------------

      const query = {};

      // City
      if (safeRules.city && safeRules.city !== "ALL") {
        query.city = safeRules.city;
      }

      if (safeRules.cities && safeRules.cities.length > 0) {
        query.city = {
          $in: safeRules.cities,
        };
      }

      // Channel
      if (safeRules.channels && safeRules.channels.length > 0) {
        query.preferredChannel = {
          $in: safeRules.channels,
        };
      }

      if (safeRules.preferredChannel) {
        query.preferredChannel = safeRules.preferredChannel;
      }

      // Tags
      if (safeRules.tags && safeRules.tags.length > 0) {
        query.tags = {
          $in: safeRules.tags,
        };
      }

      // Spending
      if (safeRules.totalSpentMin) {
        query.totalSpent = {
          ...query.totalSpent,
          $gte: safeRules.totalSpentMin,
        };
      }

      if (safeRules.totalSpentMax) {
        query.totalSpent = {
          ...query.totalSpent,
          $lte: safeRules.totalSpentMax,
        };
      }

      // Orders
      if (safeRules.totalOrdersMin) {
        query.totalOrders = {
          ...query.totalOrders,
          $gte: safeRules.totalOrdersMin,
        };
      }

      if (safeRules.totalOrdersMax) {
        query.totalOrders = {
          ...query.totalOrders,
          $lte: safeRules.totalOrdersMax,
        };
      }

      // Age
      if (safeRules.ageMin) {
        query.age = {
          ...query.age,
          $gte: safeRules.ageMin,
        };
      }

      if (safeRules.ageMax) {
        query.age = {
          ...query.age,
          $lte: safeRules.ageMax,
        };
      }

      // Last Order Filter
      if (safeRules.lastOrderDays) {
        const date = new Date();

        date.setDate(date.getDate() - safeRules.lastOrderDays);

        // Customers who DID NOT buy
        if (safeRules.lastOrderOperator === "BEFORE") {
          query.lastOrderDate = {
            $lte: date,
          };
        }

        // Customers who bought recently
        else {
          query.lastOrderDate = {
            $gte: date,
          };
        }
      }

      // Fetch Customers
      const customers = await Customer.find(query);

      // No audience found
      if (customers.length === 0) {
        return response.status(400).json({
          message: "No customers matched the segment",
        });
      }

      // Create Campaign
      const campaign = await campaignDao.createCampaign({
        name,
        description,
        rules: safeRules,
         recommendedChannel:safeRules.recommendedChannel,
        audienceSize: customers.length,
        messageTemplate: finalMessage,
        status: scheduledAt ? "DRAFT" : "PROCESSING",
        scheduledAt,
        isScheduled: !!scheduledAt,
      });

      // Scheduled Campaign
      if (scheduledAt) {
        return response.status(201).json({
          message: "Campaign scheduled successfully",
          campaign,
        });
      }

      // -------------------------
      // Send Campaign
      // -------------------------

      const communicationPromises = customers.map(async (customer) => {
        const personalizedMessage = finalMessage.includes("{name}")
          ? finalMessage.replace("{name}", customer.name)
          : finalMessage;

        const communication = await CommunicationLog.create({
          campaignId: campaign._id,
          customerId: customer._id,
          message: personalizedMessage,
          channel: campaign.recommendedChannel || customer.preferredChannel,
          status: "CREATED",
        });

        return channelFactory.send(
  campaign.recommendedChannel ||
    customer.preferredChannel,
  communication._id
);
      });

      Promise.all(communicationPromises)
        .then(() => {
          console.log(`Campaign ${campaign._id} processing finished`);
        })
        .catch((error) => {
          console.error(error);
        });

      // Mark campaign completed later
      setTimeout(async () => {
        await campaignDao.updateCampaign(campaign._id, {
          status: "COMPLETED",
        });

        console.log(`Campaign ${campaign._id} completed`);
      }, 45000);

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

getAll: async (req, res) => {
  try {
    const campaigns =
      await Campaign.find()
        .sort({
          createdAt: -1,
        });

    res.status(200).json(
      campaigns
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch campaigns",
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

      const deliveryRate =
        total > 0 ? ((delivered / total) * 100).toFixed(2) : 0;

      const clickRate =
        delivered > 0 ? ((clicked / delivered) * 100).toFixed(2) : 0;

      response.status(200).json({
        campaignId,
        total,
        delivered,
        failed,
        opened,
        read,
        clicked,
        deliveryRate,
        clickRate,
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

  getAISummary: async (request, response) => {
    try {
      const { campaignId } = request.params;

      const campaign = await campaignDao.getCampaignById(campaignId);

      if (!campaign) {
        return response.status(404).json({
          message: "Campaign not found",
        });
      }

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

      const stats = {
        total,
        delivered,
        failed,
        opened,
        read,
        clicked,
        deliveryRate: total > 0 ? ((delivered / total) * 100).toFixed(2) : 0,
        openRate: delivered > 0 ? ((opened / delivered) * 100).toFixed(2) : 0,
        clickRate: delivered > 0 ? ((clicked / delivered) * 100).toFixed(2) : 0,
      };

      const summary = await summaryService.generateSummary(campaign, stats);

      response.status(200).json({
        campaignId,
        summary,
        stats,
      });
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message: "AI summary generation failed",
      });
    }
  },
};

module.exports = campaignController;
