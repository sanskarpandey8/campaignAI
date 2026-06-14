import { useEffect, useState } from "react";
import api from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const campaigns =
        await api.get("/campaigns");

      let delivered = 0;
      let failed = 0;
      let opened = 0;
      let read = 0;
      let clicked = 0;

      for (const campaign of campaigns.data) {
        const stats =
          await api.get(
            `/campaigns/${campaign._id}/stats`
          );

        delivered +=
          stats.data.delivered;
        failed += stats.data.failed;
        opened += stats.data.opened;
        read += stats.data.read;
        clicked += stats.data.clicked;
      }

      setData([
        {
          name: "Delivered",
          value: delivered,
        },
        {
          name: "Failed",
          value: failed,
        },
        {
          name: "Opened",
          value: opened,
        },
        {
          name: "Read",
          value: read,
        },
        {
          name: "Clicked",
          value: clicked,
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">
        Analytics Dashboard
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <div
          style={{
            width: "100%",
            height: 400,
          }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={140}
                label
              >
                {data.map(
                  (_, index) => (
                    <Cell
                      key={index}
                    />
                  )
                )}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;