import { useEffect, useState } from "react";
import { getCampaigns } from "../services/api";
import { useNavigate } from "react-router-dom";

const Campaigns = () => {
  const [campaigns, setCampaigns] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns =
    async () => {
      try {
        const response =
          await getCampaigns();

        setCampaigns(
          response.data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const getStatusColor = (
    status
  ) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700";

      case "DRAFT":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getChannelColor = (
    channel
  ) => {
    switch (channel) {
      case "EMAIL":
        return "bg-blue-100 text-blue-700";

      case "WHATSAPP":
        return "bg-green-100 text-green-700";

      case "SMS":
        return "bg-orange-100 text-orange-700";

      case "RCS":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-xl">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-5xl font-bold">
          Campaigns
        </h1>

        <p className="text-gray-500 mt-3">
          Manage and monitor AI campaigns.
        </p>
      </div>

      {campaigns.length ===
      0 ? (
        <div className="bg-white p-8 rounded-3xl shadow text-center">
          <h2 className="text-2xl font-semibold">
            No campaigns found
          </h2>

          <p className="text-gray-500 mt-2">
            Create your first AI
            campaign.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {campaigns.map(
            (campaign) => (
              <div
                key={
                  campaign._id
                }
                className="
                  bg-white
                  p-6
                  rounded-3xl
                  shadow-md
                  hover:shadow-xl
                  transition-all
                  border
                "
              >

                <div className="flex justify-between items-start">

                  <h2 className="text-2xl font-bold">
                    {
                      campaign.name
                    }
                  </h2>

                  <span
                    className={`
                      px-3 py-1 rounded-full text-sm font-semibold
                      ${getStatusColor(
                        campaign.status
                      )}
                    `}
                  >
                    {
                      campaign.status
                    }
                  </span>

                </div>

                <p className="text-gray-500 mt-3 line-clamp-3">
                  {campaign.description ||
                    "No description available"}
                </p>

                <div className="mt-6 space-y-3">

                  <div className="flex justify-between">
                    <span>
                      Audience
                    </span>

                    <span className="font-semibold">
                      👥{" "}
                      {
                        campaign.audienceSize
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Channel
                    </span>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm font-semibold
                        ${getChannelColor(
                          campaign.recommendedChannel
                        )}
                      `}
                    >
                      {campaign.recommendedChannel ||
                        "AUTO"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Created
                    </span>

                    <span className="text-gray-500">
                      {new Date(
                        campaign.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/campaigns/${campaign._id}`
                    )
                  }
                  className="
                    mt-6
                    w-full
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    py-3
                    rounded-xl
                    font-semibold
                    hover:scale-105
                    transition-all
                  "
                >
                  View Details
                </button>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
};

export default Campaigns;