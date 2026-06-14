const channelService = require("../channelService");

const rcsService = {
  send: async (communicationId) => {
    console.log("Sending via RCS");

    return channelService.sendMessage(
      communicationId
    );
  },
};

module.exports = rcsService;