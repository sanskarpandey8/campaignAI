import { useState } from "react";
import API from "../services/api";

const CreateCampaign = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal: "",
    messageTemplate: "",
    city: "",
    tags: "",
    lastOrderDays: " ",
  });

  const [aiData, setAiData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const generateAI =
    async () => {
      try {
        setLoading(true);

        const prompt = `
Generate a campaign for:

Goal: ${form.goal}

City: ${form.city}

Tag: ${form.tags}

Inactive for ${form.lastOrderDays} days
`;

        const response =
          await API.post(
            "/copilot/generate",
            { prompt }
          );

        setAiData(
          response.data
        );

        setForm((prev) => ({
          ...prev,
          messageTemplate:
            response.data
              .messageTemplate,
        }));
      } catch (error) {
        console.error(error);

        alert(
          "AI generation failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const createCampaign =
    async () => {
      try {
        const payload = {
          name: form.name,
          description:
            form.description,

          goal: form.goal,

          messageTemplate:
            form.messageTemplate,

          recommendedChannel:
            aiData?.recommendedChannel,

          rules: {
            cities: form.city
              ? [form.city]
              : [],

            tags: form.tags
              ? [form.tags]
              : [],

            lastOrderDays:
              Number(
                form.lastOrderDays
              ),

            lastOrderOperator:
              "BEFORE",
          },
        };

        const response =
          await API.post(
            "/campaigns",
            payload
          );

        alert(
          "Campaign Created!"
        );

        console.log(
          response.data
        );
      } catch (error) {
        console.error(error);

        alert(
          "Campaign creation failed"
        );
      }
    };

  return (
    <div className="grid lg:grid-cols-2 gap-8">

      {/* Left Form */}

      <div className="bg-white p-8 rounded-3xl shadow-lg">

        <h1 className="text-4xl font-bold">
          Create AI Campaign 
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Generate personalized campaigns
          using AI.
        </p>

        <div className="grid gap-4">

          <input
            name="name"
            placeholder="Campaign Name"
            className="border p-3 rounded-xl"
            value={form.name}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="border p-3 rounded-xl"
            value={form.description}
            onChange={handleChange}
          />

          <textarea
            name="goal"
            placeholder="AI Goal"
            className="border p-3 rounded-xl"
            value={form.goal}
            onChange={handleChange}
          />

          <textarea
            name="messageTemplate"
            placeholder="Message Template"
            className="border p-3 rounded-xl"
            value={
              form.messageTemplate
            }
            onChange={handleChange}
          />

          <select
            name="city"
            className="border p-3 rounded-xl"
            value={form.city}
            onChange={handleChange}
          >
            <option value="">
              Select City
            </option>

            <option value="Delhi">
              Delhi
            </option>

            <option value="Mumbai">
              Mumbai
            </option>

            <option value="Bangalore">
              Bangalore
            </option>

            <option value="Chandigarh">
              Chandigarh
            </option>
          </select>

          <input
            name="tags"
            placeholder="Tag (premium)"
            className="border p-3 rounded-xl"
            value={form.tags}
            onChange={handleChange}
          />

          <input
            type="number"
            name="lastOrderDays"
            placeholder="Last Order Days"
            className="border p-3 rounded-xl"
            value={
              form.lastOrderDays
            }
            onChange={handleChange}
          />

          <div className="flex gap-4">

            <button
              onClick={
                generateAI
              }
              className="
                flex-1
                bg-slate-900
                text-white
                py-3
                rounded-xl
                font-semibold
              "
            >
              {loading
                ? "Generating..."
                : "Generate AI "}
            </button>

            <button
              onClick={
                createCampaign
              }
              className="
                flex-1
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                py-3
                rounded-xl
                font-semibold
              "
            >
              Launch 
            </button>

          </div>

        </div>

      </div>

      {/* Right Preview */}

      <div className="bg-white p-8 rounded-3xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6">
          AI Preview 
        </h2>

        <div className="space-y-6">

          <div>
            <p className="text-gray-500">
              Recommended Channel
            </p>

            <span
              className="
                bg-green-100
                text-green-700
                px-4 py-2
                rounded-full
                font-semibold
              "
            >
              {aiData?.recommendedChannel ||
                "Not Generated"}
            </span>
          </div>

          <div>
            <p className="text-gray-500">
              Audience Size
            </p>

            <h3 className="text-3xl font-bold">
              {aiData?.audienceSize
                ??"--"}
            </h3>
          </div>

          <div>
            <p className="text-gray-500 mb-2">
              Generated Message
            </p>

            <div
              className="
                bg-slate-100
                p-4
                rounded-2xl
              "
            >
              {form.messageTemplate ||
                "AI generated message will appear here"}
            </div>
          </div>

          <div>
            <p className="text-gray-500 mb-2">
              AI Reasoning
            </p>

            <div
              className="
                bg-blue-50
                p-4
                rounded-2xl
                text-sm
              "
            >
              {aiData?.aiReasoning ||
                "AI recommendations will appear here."}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CreateCampaign;