const aiService = require(
  "../services/aiService"
);

const subjectController = {
  generate: async (req, res) => {
    try {
      const {
        campaignGoal,
        audience,
      } = req.body;

      const subjects =
        await aiService.generateSubjectLines(
          campaignGoal,
          audience
        );

      res.status(200).json({
        subjects,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Subject generation failed",
      });
    }
  },
};

module.exports =
  subjectController;