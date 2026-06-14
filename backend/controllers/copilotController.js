const copilotService = require("../services/copilotService");

const campaignController = require("./campaignController");

const copilotController = {
  generate: async (req, res) => {
    try {
      const { prompt } = req.body;

      const result = await copilotService.generateCampaign(prompt);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "AI generation failed",
      });
    }
  },

  launch: async (req, res) => {
    try {
      const { prompt } = req.body;

      const aiCampaign = await copilotService.generateCampaign(prompt);

      req.body = {
        name: aiCampaign.campaignName,

        description: aiCampaign.aiReasoning,

        rules: {
          ...aiCampaign.rules,
          recommendedChannel: aiCampaign.recommendedChannel,
        },

        messageTemplate: aiCampaign.messageTemplate,
      };

      return campaignController.create(req, res);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "AI launch failed",
      });
    }
  },
};

module.exports = copilotController;
