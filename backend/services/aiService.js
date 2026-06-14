const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const aiService = {
  generateMessage: async (
    audience,
    goal
  ) => {
    try {
      const completion =
        await client.chat.completions.create({
          model: "openai/gpt-oss-120b:free",

          messages: [
            {
              role: "system",
              content:
                "You are an expert marketing copywriter. Generate short CRM campaign messages using {name} as placeholder.",
            },
            {
              role: "user",
              content: `
Audience: ${audience}

Goal: ${goal}

Generate a personalized marketing message under 40 words using {name} placeholder.
              `,
            },
          ],
        });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  generateSubjectLines: async (
  campaignGoal,
  audience
) => {
  try {
    const completion =
      await client.chat.completions.create({
        model:
          "openai/gpt-oss-120b:free",

        messages: [
          {
            role: "system",
            content: `
You are an expert marketing copywriter.

Generate exactly 5 email subject lines.

Rules:
- Maximum 10 words each
- Engaging and professional
- Return ONLY valid JSON array
- No markdown
- No explanation

Example:
[
  "We Miss You, Premium Member!",
  "Exclusive Deal Waiting for You",
  "Special Offer Just for Delhi Users",
  "Unlock Your Premium Rewards Today",
  "Come Back and Save More"
]
            `,
          },
          {
            role: "user",
            content: `
Campaign Goal: ${campaignGoal}

Audience: ${audience}
            `,
          },
        ],

        temperature: 0.8,
      });

    const content =
      completion.choices[0]
        .message.content;

    const cleaned =
      content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      console.error(
        "JSON Parse Error:",
        cleaned
      );

      return [
        "Exclusive Offer Just for You",
        "We Miss You, Come Back Today",
        "Special Rewards Await You",
        "Unlock Premium Savings Now",
        "Your Next Deal Is Here",
      ];
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
},
};

module.exports = aiService;