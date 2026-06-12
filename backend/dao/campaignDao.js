const Campaign = require("../models/Campaign");

const campaignDao = {
  createCampaign: async (campaignData) => {
    return await Campaign.create(campaignData);
  },

  getAllCampaigns: async () => {
    return await Campaign.find().sort({
      createdAt: -1,
    });
  },

  getCampaignById: async (campaignId) => {
    return await Campaign.findById(campaignId);
  },

  updateCampaign: async (
    campaignId,
    updateData
  ) => {
    return await Campaign.findByIdAndUpdate(
      campaignId,
      updateData,
      { new: true }
    );
  },
};

module.exports = campaignDao;