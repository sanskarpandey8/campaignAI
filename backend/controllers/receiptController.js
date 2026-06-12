const CommunicationLog = require(
  "../models/CommunicationLog"
);

const receiptController = {
  updateStatus: async (
    request,
    response
  ) => {
    try {
      const {
        communicationId,
        status,
      } = request.body;

      const communication =
        await CommunicationLog.findByIdAndUpdate(
          communicationId,
          { status },
          { new: true }
        );

      if (!communication) {
        return response
          .status(404)
          .json({
            message:
              "Communication not found",
          });
      }

      response.status(200).json({
        message:
          "Receipt processed successfully",
        communication,
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

module.exports = receiptController;