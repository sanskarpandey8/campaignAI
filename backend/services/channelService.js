const axios = require("axios");
const CommunicationLog = require(
  "../models/CommunicationLog"
);

const channelService = {
  sendMessage: async (
    communicationId
  ) => {
    try {
      await CommunicationLog.findByIdAndUpdate(
        communicationId,
        {
          status: "SENT",
        }
      );

      console.log(
        `Communication ${communicationId} -> SENT`
      );

      setTimeout(async () => {
        try {
          const communication =
            await CommunicationLog.findById(
              communicationId
            );

          if (!communication) {
            return;
          }

          const statuses = [
            "DELIVERED",
            "FAILED",
            "OPENED",
            "READ",
            "CLICKED",
          ];

          let randomStatus =
            statuses[
              Math.floor(
                Math.random() *
                  statuses.length
              )
            ];
        //let randomStatus = "FAILED";

          // Retry if FAILED
          if (
            randomStatus === "FAILED" &&
            communication.retryCount <
              communication.maxRetries
          ) {
            await CommunicationLog.findByIdAndUpdate(
              communicationId,
              {
                $inc: {
                  retryCount: 1,
                },
              }
            );

            console.log(
              `Retrying communication ${communicationId}`
            );

            return channelService.sendMessage(
              communicationId
            );
          }

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
            "Retry Error:",
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