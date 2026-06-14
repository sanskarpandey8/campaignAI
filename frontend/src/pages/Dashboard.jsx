import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    campaigns: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        customersRes,
        ordersRes,
        campaignsRes,
      ] = await Promise.all([
        api.get("/customers"),
        api.get("/orders"),
        api.get("/campaigns"),
      ]);

      setStats({
        customers:
          customersRes.data.length,
        orders:
          ordersRes.data.length,
        campaigns:
          campaignsRes.data.length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        CampaignAI Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl text-slate-300">
            Customers
          </h2>

          <p className="text-4xl font-bold mt-2">
            {stats.customers}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl text-slate-300">
            Orders
          </h2>

          <p className="text-4xl font-bold mt-2">
            {stats.orders}
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl text-slate-300">
            Campaigns
          </h2>

          <p className="text-4xl font-bold mt-2">
            {stats.campaigns}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;