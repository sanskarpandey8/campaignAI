import { useEffect, useState } from "react";

import { getDashboardStats } from "../services/api";

import StatCard from "../components/StatCard";

import SubjectGenerator from
  "../components/SubjectGenerator";

const Dashboard = () => {
  const [stats, setStats] = useState({
    campaigns: 0,
    customers: 0,
    deliveryRate: 0,
    ctr: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response =
        await getDashboardStats();

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-5xl font-bold">
          AI-Powered CRM
        </h1>

        <p className="text-gray-500 mt-3 text-lg">
          Manage campaigns and customer engagement.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Campaigns"
          value={stats.campaigns}
          color="text-blue-600"
        />

        <StatCard
          title="Customers"
          value={stats.customers}
          color="text-green-500"
        />

        <StatCard
          title="Delivery Rate"
          value={`${stats.deliveryRate}%`}
          color="text-purple-500"
        />

        <StatCard
          title="CTR"
          value={`${stats.ctr}%`}
          color="text-orange-500"
        />
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm">
        <h2 className="text-2xl font-semibold">
          Welcome to CampaignAI
        </h2>

        <p className="text-gray-500 mt-3">
          AI-powered customer relationship management
          with smart segmentation, campaigns and
          analytics.
        </p>
      </div>

      <SubjectGenerator />
    </div>
  );
};

export default Dashboard;