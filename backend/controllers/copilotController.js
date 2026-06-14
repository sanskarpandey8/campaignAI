const copilotService = require(
  "../services/copilotService"
);

const campaignController = require(
  "./campaignController"
);

const Customer = require(
  "../models/Customer"
);

const copilotController = {
  generate: async (req, res) => {
    try {
      const { prompt } = req.body;

      const result =
        await copilotService.generateCampaign(
          prompt
        );

      // Build customer query
      const query = {};

      if (
        result.rules?.cities?.length
      ) {
        query.city = {
          $in:
            result.rules.cities,
        };
      }

      if (
        result.rules?.tags?.length
      ) {
        query.tags = {
          $in:
            result.rules.tags,
        };
      }

      // Count matching customers
      const audienceSize =
        await Customer.countDocuments(
          query
        );

        console.log(
  "AI Rules:",
  result.rules
);

console.log(
  "Mongo Query:",
  query
);

console.log(
  "Audience Size:",
  audienceSize
);

      result.audienceSize =
        audienceSize;

console.log(result);


      res.status(200).json(
        result
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "AI generation failed",
      });
    }
  },

  launch: async (req, res) => {
    try {
      const { prompt } = req.body;

      const aiCampaign =
        await copilotService.generateCampaign(
          prompt
        );

      req.body = {
        name:
          aiCampaign.campaignName,

        description:
          aiCampaign.aiReasoning,

        rules:
          aiCampaign.rules,

        messageTemplate:
          aiCampaign.messageTemplate,

        recommendedChannel:
          aiCampaign.recommendedChannel,
      };

      return campaignController.create(
        req,
        res
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "AI launch failed",
      });
    }
  },
};

module.exports =
  copilotController;