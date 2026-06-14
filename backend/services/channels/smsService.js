const channelService = require("../channelService");

const smsService = {
  send: async (communicationId) => {
    console.log("Sending via SMS");

    return channelService.sendMessage(
      communicationId
    );
  },
};

module.exports = smsService;