const axios = require("axios");
const CommunicationLog = require(
  "../models/CommunicationLog"
);

const channelService = {
  sendMessage: async (
    communicationId
  ) => {
    try {
      // Mark communication as SENT
      await CommunicationLog.findByIdAndUpdate(
        communicationId,
        {
          status: "SENT",
        }
      );

      console.log(
        `Communication ${communicationId} -> SENT`
      );

      // Simulate async delivery callback
      setTimeout(async () => {
        const statuses = [
          "DELIVERED",
          "FAILED",
          "OPENED",
          "READ",
          "CLICKED",
        ];

        const randomStatus =
          statuses[
            Math.floor(
              Math.random() *
                statuses.length
            )
          ];

        try {
          await axios.post(
            "http://localhost:5000/api/receipts",
            {
              communicationId,
              status: randomStatus,
            }
          );

          console.log(
            `Receipt callback sent: ${randomStatus}`
          );
        } catch (error) {
          console.error(
            "Receipt callback failed:",
            error.message
          );
        }
      }, 3000);
    } catch (error) {
      console.error(
        "Channel Service Error:",
        error.message
      );
    }
  },
};

module.exports = channelService;