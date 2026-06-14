const axios = require("axios");
const CommunicationLog = require("../models/CommunicationLog");

const RECEIPT_API =
  "http://localhost:5000/api/receipts";

const sleep = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

const channelService = {
  sendMessage: async (
    communicationId
  ) => {
    try {
      const sendReceipt =
        async (status) => {
          await axios.post(
            RECEIPT_API,
            {
              communicationId,
              status,
            }
          );

          console.log(
            `Communication ${communicationId} -> ${status}`
          );
        };

      // Message created
      await sendReceipt("SENT");

      await sleep(1000);

      // 20% chance of failure
      if (Math.random() < 0.2) {
        const communication =
          await CommunicationLog.findById(
            communicationId
          );

        if (
          communication &&
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
            `Retrying ${communicationId}`
          );

          return channelService.sendMessage(
            communicationId
          );
        }

        await sendReceipt(
          "FAILED"
        );
        return;
      }

      // Delivered
      await sendReceipt(
        "DELIVERED"
      );

      await sleep(1000);

      // 70% open rate
      if (Math.random() < 0.7) {
        await sendReceipt(
          "OPENED"
        );

        await sleep(1000);

        // 60% read rate
        if (Math.random() < 0.6) {
          await sendReceipt(
            "READ"
          );

          await sleep(1000);

          // 30% click rate
          if (
            Math.random() < 0.3
          ) {
            await sendReceipt(
              "CLICKED"
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Channel Service Error:",
        error.message
      );
    }
  },
};

module.exports =
  channelService;