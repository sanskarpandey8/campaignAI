const channelService = require("../channelService");

const emailService = {
  send: async (communicationId) => {
    console.log("Sending via EMAIL");

    return channelService.sendMessage(
      communicationId
    );
  },
};

module.exports = emailService;