import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Customers
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 rounded-xl overflow-hidden">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                City
              </th>

              <th className="p-4 text-left">
                Spent
              </th>

              <th className="p-4 text-left">
                Orders
              </th>

              <th className="p-4 text-left">
                Channel
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map(
              (customer) => (
                <tr
                  key={
                    customer._id
                  }
                  className="border-b border-slate-700 hover:bg-slate-700"
                >
                  <td className="p-4">
                    {customer.name}
                  </td>

                  <td className="p-4">
                    {customer.email}
                  </td>

                  <td className="p-4">
                    {customer.city}
                  </td>

                  <td className="p-4">
                    ₹
                    {
                      customer.totalSpent
                    }
                  </td>

                  <td className="p-4">
                    {
                      customer.totalOrders
                    }
                  </td>

                  <td className="p-4">
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                      {
                        customer.preferredChannel
                      }
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;