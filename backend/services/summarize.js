const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const summarize = async (text) => {
  if (!text || typeof text !== "string") {
    console.log("⚠️ Invalid input to summarize():", text);
    return "No content to summarize.";
  }

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "user", content: `Summarize this in a fun, casual tone:\n\n${text}` },
      ],
      max_tokens: 100,
    });

    return res.choices[0].message.content.trim();
  } catch (err) {
    console.error("Summarization error:", err.message);
    return "Error generating summary.";
  }
};

module.exports = summarize;
