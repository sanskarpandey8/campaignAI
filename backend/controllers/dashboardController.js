const Campaign = require("../models/Campaign");
const Customer = require("../models/Customer");
const CommunicationLog = require("../models/CommunicationLog");

const dashboardController = {
  getStats: async (req, res) => {
    try {
      const campaigns =
        await Campaign.countDocuments();

      const customers =
        await Customer.countDocuments();

      const totalLogs =
        await CommunicationLog.countDocuments();

      const delivered =
        await CommunicationLog.countDocuments({
          status: "DELIVERED",
        });

      const clicked =
        await CommunicationLog.countDocuments({
          status: "CLICKED",
        });

      const deliveryRate =
        totalLogs > 0
          ? (
              (delivered / totalLogs) *
              100
            ).toFixed(2)
          : 0;

      const ctr =
        delivered > 0
          ? (
              (clicked / delivered) *
              100
            ).toFixed(2)
          : 0;

      res.status(200).json({
        campaigns,
        customers,
        deliveryRate,
        ctr,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Dashboard API failed",
      });
    }
  },
};

module.exports = dashboardController;