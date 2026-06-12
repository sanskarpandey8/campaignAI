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
};

module.exports = aiService;