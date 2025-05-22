// backend/services/summarize.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const summarize = async (text) => {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Summarize this in a fun, casual tone:\n\n${text}` },
      ],
      max_tokens: 100,
    });

    return res.choices[0].message.content.trim();
  } catch (err) {
    console.error("Summarization error:", err.message);
    return "Couldn’t summarize this one.";
  }
};

module.exports = summarize;
