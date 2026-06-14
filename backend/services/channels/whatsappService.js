const channelService = require("../channelService");

const whatsappService = {
  send: async (communicationId) => {
    console.log("Sending via WHATSAPP");

    return channelService.sendMessage(
      communicationId
    );
  },
};

module.exports = whatsappService;