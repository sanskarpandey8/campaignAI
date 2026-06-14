import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getCampaignById,
  getCampaignStats,
  getCampaignLogs,
  getAISummary,
} from "../services/api";

const CampaignDetails = () => {
  const { id } = useParams();

  const [campaign, setCampaign] =
    useState(null);

  const [stats, setStats] =
    useState(null);

  const [summary, setSummary] =
    useState("");

  const [logs, setLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData =
    async () => {
      try {
        const [
          campaignRes,
          statsRes,
          summaryRes,
          logsRes,
        ] = await Promise.all([
          getCampaignById(id),
          getCampaignStats(id),
          getAISummary(id),
          getCampaignLogs(id),
        ]);

        setCampaign(
          campaignRes.data
        );

        setStats(
          statsRes.data
        );

        setSummary(
          summaryRes.data
        );

        setLogs(
          logsRes.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="text-center text-2xl">
        Loading...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center text-red-500">
        Campaign not found
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="bg-white p-8 rounded-3xl shadow">

        <h1 className="text-4xl font-bold">
          {campaign.name}
        </h1>

        <p className="text-gray-500 mt-3">
          {campaign.description}
        </p>

        <div className="flex gap-4 mt-6 flex-wrap">

          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
            {campaign.status}
          </span>

          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            {campaign.recommendedChannel}
          </span>

          <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold">
            Audience:{" "}
            {campaign.audienceSize}
          </span>

        </div>

      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-gray-500">
            Delivered
          </h3>

          <p className="text-3xl font-bold">
            {stats.delivered}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-gray-500">
            Opened
          </h3>

          <p className="text-3xl font-bold">
            {stats.opened}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-gray-500">
            Clicked
          </h3>

          <p className="text-3xl font-bold">
            {stats.clicked}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow">
          <h3 className="text-gray-500">
            CTR
          </h3>

          <p className="text-3xl font-bold">
            {stats.clickRate}%
          </p>
        </div>

      </div>

      {/* Message */}

      <div className="bg-white p-8 rounded-3xl shadow">

        <h2 className="text-2xl font-bold mb-4">
          Campaign Message
        </h2>

        <div className="bg-slate-100 p-4 rounded-2xl">
          {
            campaign.messageTemplate
          }
        </div>

      </div>


      {/* Communication Logs */}

      <div className="bg-white p-8 rounded-3xl shadow">

        <h2 className="text-2xl font-bold mb-6">
          Communication Logs
        </h2>

        <div className="space-y-4">

          {logs.length === 0 ? (
            <p className="text-gray-500">
              No logs found
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="
                  flex
                  justify-between
                  items-center
                  p-4
                  border
                  rounded-2xl
                "
              >
                <div>
                  <h3 className="font-semibold">
                    {
                      log.customerId
                        ?.name
                    }
                  </h3>

                  <p className="text-sm text-gray-500">
                    {
                      log.customerId
                        ?.email
                    }
                  </p>
                </div>

                <span className="font-semibold">
                  {log.status}
                </span>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
};

export default CampaignDetails;