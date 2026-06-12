const CommunicationLog = require(
  "../models/CommunicationLog"
);

const channelService = {
  sendMessage: async (
    communicationId
  ) => {
    await CommunicationLog.findByIdAndUpdate(
      communicationId,
      {
        status: "SENT",
      }
    );

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

      await CommunicationLog.findByIdAndUpdate(
        communicationId,
        {
          status: randomStatus,
        }
      );

      console.log(
        `Communication ${communicationId} -> ${randomStatus}`
      );
    }, 3000);
  },
};

module.exports = channelService;