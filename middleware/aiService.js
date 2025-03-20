const axios = require("axios");

async function askAI(systemPrompt, userPrompt) {
  const response = await axios.post(
    "https://models.inference.ai.azure.com/chat/completions",
    {
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            userPrompt +
            "і відповідь давай просто текстом без форматування жирним і тд. Можеш хіба підпункти робити і переносів рядка",
        },
      ],
      model: "gpt-4o-mini",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = { askAI };
