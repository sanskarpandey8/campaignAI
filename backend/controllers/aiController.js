const aiService = require(
  "../services/aiService"
);

const aiController = {
  generateMessage: async (
    request,
    response
  ) => {
    try {
      const { audience, goal } =
        request.body;

      const message =
        await aiService.generateMessage(
          audience,
          goal
        );

      response.status(200).json({
        message,
      });
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message:
          "AI generation failed",
      });
    }
  },
};

module.exports = aiController;