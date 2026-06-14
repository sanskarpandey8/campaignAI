import { useState } from "react";
import API from "../services/api";

const Copilot = () => {
  const [prompt, setPrompt] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const generateAI =
    async () => {
      if (!prompt.trim()) {
        alert("Enter a prompt");
        return;
      }

      try {
        setLoading(true);

        const response =
          await API.post(
            "/copilot/generate",
            { prompt }
          );

        setResult(
          response.data
        );
      } catch (error) {
        console.error(error);

        alert(
          "AI generation failed"
        );
      } finally {
        setLoading(false);
      }
    };

  const launchCampaign =
    async () => {
      try {
        await API.post(
          "/copilot/launch",
          { prompt }
        );

        alert(
          "Campaign launched successfully!"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Campaign launch failed"
        );
      }
    };

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

      {/* Input */}

      <div className="bg-white p-8 rounded-3xl shadow">

        <h1 className="text-4xl font-bold">
          AI Copilot 
        </h1>

        <p className="text-gray-500 mt-2">
          Ask AI to create intelligent marketing campaigns.
        </p>

        <textarea
          rows={8}
          value={prompt}
          onChange={(e) =>
            setPrompt(
              e.target.value
            )
          }
          placeholder="Example: Create a campaign for inactive premium customers in Delhi who haven't ordered in 90 days."
          className="
            w-full
            border
            rounded-2xl
            p-4
            mt-6
            outline-none
          "
        />

        <button
          onClick={generateAI}
          disabled={loading}
          className="
            mt-6
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
          "
        >
          {loading
            ? "Generating..."
            : "Generate Campaign"}
        </button>

      </div>

      {/* AI Result */}

      <div className="bg-white p-8 rounded-3xl shadow">

        <h2 className="text-3xl font-bold">
          AI Response
        </h2>

        {!result ? (
          <p className="text-gray-500 mt-6">
            AI recommendations will appear here.
          </p>
        ) : (
          <div className="space-y-6 mt-6">

            <div>
              <h3 className="font-semibold">
                Campaign Name
              </h3>

              <p className="text-gray-600">
                {
                  result.campaignName
                }
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Recommended Channel
              </h3>

              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                {
                  result.recommendedChannel
                }
              </span>
            </div>

            <div>
              <h3 className="font-semibold">
                Audience Size
              </h3>

              <p className="text-gray-600">
                {
                  result.audienceSize
                }
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                AI Reasoning
              </h3>

              <p className="text-gray-600">
                {
                  result.aiReasoning
                }
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Generated Message
              </h3>

              <div className="bg-slate-100 p-4 rounded-2xl">
                {
                  result.messageTemplate
                }
              </div>
            </div>

            <button
              onClick={
                launchCampaign
              }
              className="
                w-full
                bg-gradient-to-r
                from-green-600
                to-emerald-600
                text-white
                py-3
                rounded-xl
                font-semibold
              "
            >
              Launch Campaign
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default Copilot;