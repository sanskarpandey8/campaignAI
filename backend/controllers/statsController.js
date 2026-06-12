const CommunicationLog = require(
  "../models/CommunicationLog"
);

const statsController = {
  getStats: async (
    request,
    response
  ) => {
    try {
      const total =
        await CommunicationLog.countDocuments();

      const delivered =
        await CommunicationLog.countDocuments({
          status: "DELIVERED",
        });

      const opened =
        await CommunicationLog.countDocuments({
          status: "OPENED",
        });

      const read =
        await CommunicationLog.countDocuments({
          status: "READ",
        });

      const clicked =
        await CommunicationLog.countDocuments({
          status: "CLICKED",
        });

      const failed =
        await CommunicationLog.countDocuments({
          status: "FAILED",
        });

      response.status(200).json({
        total,
        delivered,
        opened,
        read,
        clicked,
        failed,

        deliveryRate:
          total > 0
            ? (
                (delivered / total) *
                100
              ).toFixed(2)
            : 0,

        openRate:
          total > 0
            ? (
                (opened / total) *
                100
              ).toFixed(2)
            : 0,

        clickRate:
          total > 0
            ? (
                (clicked / total) *
                100
              ).toFixed(2)
            : 0,

        failureRate:
          total > 0
            ? (
                (failed / total) *
                100
              ).toFixed(2)
            : 0,
      });
    } catch (error) {
      console.error(error);

      response.status(500).json({
        message:
          "Internal server error",
      });
    }
  },
};

module.exports = statsController;