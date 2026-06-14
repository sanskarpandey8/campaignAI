const OpenAI = require("openai");

const client = new OpenAI({
  apiKey:
    process.env.OPENROUTER_API_KEY,
  baseURL:
    "https://openrouter.ai/api/v1",
});

const summaryService = {
  generateSummary: async (
    campaign,
    stats
  ) => {
    const completion =
      await client.chat.completions.create({
        model:
          "openai/gpt-oss-120b:free",

        messages: [
          {
            role: "system",
            content: `
You are an AI CRM analyst.

Analyze ONLY the provided statistics.

Rules:
- Never assume information not present.
- Never mention tracking errors.
- Never mention delivery failures unless failed > 0.
- Never speculate about user behavior.
- Base conclusions strictly on numbers.

Return ONLY valid JSON:

{
  "performanceSummary": "",
  "engagementInsight": "",
  "channelInsight": "",
  "recommendation": ""
}
`,
          },
          {
            role: "user",
            content: `
Campaign Name: ${campaign.name}

Audience Size: ${campaign.audienceSize}

Status: ${campaign.status}

Statistics:
${JSON.stringify(
  stats,
  null,
  2
)}
`,
          },
        ],

        temperature: 0.3,
      });

    const content =
      completion.choices[0]
        .message.content;

    const cleaned =
      content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/\*\*/g, "")
        .trim();

    const result =
      JSON.parse(cleaned);

    return result;
  },
};

module.exports =
  summaryService;