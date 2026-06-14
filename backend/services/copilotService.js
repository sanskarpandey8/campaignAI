const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const copilotService = {
  generateCampaign: async (prompt) => {
    const completion =
      await client.chat.completions.create({
        model:
          "openai/gpt-oss-120b:free",

        messages: [
          {
            role: "system",
            content: `
You are an AI marketing copilot for a D2C retail brand.

Your job is to help marketers create intelligent campaigns.

Return ONLY valid JSON.

Schema:

{
  "campaignName": "",
  "rules": {
    "cities": [],
    "tags": [],
    "channels": [],
    "totalSpentMin": 0,
    "totalSpentMax": 0,
    "totalOrdersMin": 0,
    "totalOrdersMax": 0,
    "ageMin": 0,
    "ageMax": 0,
    "lastOrderDays": 0,
    "lastOrderOperator": "BEFORE"
  },
  "recommendedChannel": "",
  "aiReasoning": "",
  "usePersonalization": false,
  "messageTemplate": ""
}

Allowed channels:
EMAIL
SMS
WHATSAPP
RCS

Rules:
- Return ONLY JSON.
- Do not wrap JSON in markdown.
- Generate only the message body.
- Do not include email subjects.
- Do not use markdown formatting.
- Keep messages under 300 characters.
- Messages should work across WhatsApp, SMS, Email and RCS.
- Use {name} only if personalization improves engagement.
- Otherwise generate a generic message.
- Set usePersonalization accordingly.

Marketing strategy:
- Prefer WHATSAPP for premium or loyal customers.
- Prefer EMAIL for inactive customers.
- Prefer SMS for urgent flash sales.
- Prefer RCS for rich promotional campaigns.
- Always explain channel choice in aiReasoning.
- Infer audience intelligently from business intent.

Do NOT include placeholders other than {name}.
Do NOT generate email subjects.
Do NOT generate greetings unless personalization is useful.
Return concise omnichannel messages.

IMPORTANT:
- Never generate email subjects.
- Never use placeholders except {name}.
- If personalization is not useful, generate a generic message.
- Return omnichannel-friendly messages that work on SMS, WhatsApp, Email and RCS.
- Do not mention "Subject:" anywhere.

`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
      });

    const content =
      completion.choices[0]
        .message.content;

    // Remove markdown if model returns it
    const cleaned =
      content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    const result =
      JSON.parse(cleaned);

    // Default values
    result.rules ??= {};
    result.usePersonalization ??=
      false;

    // Clean message
    if (result.messageTemplate) {
  result.messageTemplate =
    result.messageTemplate

      // Placeholder normalization
      .replaceAll(
        "{{firstName}}",
        "{name}"
      )
      .replaceAll(
        "{{first_name}}",
        "{name}"
      )
      .replaceAll(
        "{{firstname}}",
        "{name}"
      )
      .replaceAll(
        "{{name}}",
        "{name}"
      )

      // Remove email subject
      .replace(
        /^Subject:.*$/gim,
        ""
      )

      // Remove markdown
      .replace(/\*\*/g, "")

      // Remove brand placeholders
      .replace(
        /\[Brand Name\]/gi,
        "CampaignAI"
      )

      // Clean extra spaces/newlines
      .replace(
        /\n{3,}/g,
        "\n\n"
      )

      .trim();

    }

    // Ensure valid channel
    const validChannels = [
      "EMAIL",
      "SMS",
      "WHATSAPP",
      "RCS",
    ];

    if (
      !validChannels.includes(
        result.recommendedChannel
      )
    ) {
      result.recommendedChannel =
        "EMAIL";
    }

    return result;
  },
};

module.exports =
  copilotService;