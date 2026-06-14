const emailService = require("./emailService");
const smsService = require("./smsService");
const whatsappService = require("./whatsappService");
const rcsService = require("./rcsService");

const channelFactory = {
  send: async (
    channel,
    communicationId
  ) => {
    switch (channel) {
      case "EMAIL":
        return emailService.send(
          communicationId
        );

      case "SMS":
        return smsService.send(
          communicationId
        );

      case "WHATSAPP":
        return whatsappService.send(
          communicationId
        );

      case "RCS":
        return rcsService.send(
          communicationId
        );

      default:
        throw new Error(
          `Unsupported channel: ${channel}`
        );
    }
  },
};

module.exports = channelFactory;