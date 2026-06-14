import { useState } from "react";
import api from "../services/api";

function CreateCampaign() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    goal: "",
    scheduledAt: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        description:
          formData.description,
        rules: {
          city: formData.city,
        },
        goal: formData.goal,
        scheduledAt:
          formData.scheduledAt ||
          undefined,
      };

      const response =
        await api.post(
          "/campaigns",
          payload
        );

      alert(
        response.data.message
      );

      setFormData({
        name: "",
        description: "",
        city: "",
        goal: "",
        scheduledAt: "",
      });
    } catch (error) {
      console.error(error);

      alert(
        "Campaign creation failed"
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">
          Create Campaign
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Campaign Name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            className="w-full p-3 rounded bg-slate-700"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            className="w-full p-3 rounded bg-slate-700"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={
              formData.city
            }
            onChange={
              handleChange
            }
            className="w-full p-3 rounded bg-slate-700"
          />

          <textarea
            name="goal"
            placeholder="AI Campaign Goal"
            value={
              formData.goal
            }
            onChange={
              handleChange
            }
            className="w-full p-3 rounded bg-slate-700"
          />

          <div>
            <label className="block mb-2">
              Schedule Campaign
            </label>

            <input
              type="datetime-local"
              name="scheduledAt"
              value={
                formData.scheduledAt
              }
              onChange={
                handleChange
              }
              className="w-full p-3 rounded bg-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold"
          >
            {loading
              ? "Creating..."
              : "Create Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCampaign;