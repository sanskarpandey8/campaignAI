import { useEffect, useState } from "react";
import api from "../services/api";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await api.get("/campaigns");
      setCampaigns(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Campaigns
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Audience
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Message
              </th>

              <th className="p-4 text-left">
                Created
              </th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign._id}
                className="border-b border-slate-700 hover:bg-slate-700"
              >
                <td className="p-4">
                  {campaign.name}
                </td>

                <td className="p-4">
                  {campaign.audienceSize}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      campaign.status ===
                      "COMPLETED"
                        ? "bg-green-600"
                        : campaign.status ===
                            "DRAFT"
                          ? "bg-yellow-600"
                          : "bg-blue-600"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>

                <td className="p-4 max-w-md truncate">
                  {campaign.messageTemplate}
                </td>

                <td className="p-4">
                  {new Date(
                    campaign.createdAt
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Campaigns;