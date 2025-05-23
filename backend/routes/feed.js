const express = require("express");
const router = express.Router();
const axios = require("axios");

const summarize = require("../services/summarize");
const fetchTweets = require("../services/fetchTweets");

router.post("/", async (req, res) => {
  console.log("✅ /api/feed hit");

  const { interests } = req.body;
  const allArticles = [];

  try {
    for (const topic of interests) {
      // 🧠 Skip if topic is missing or not a string
      if (!topic || typeof topic !== "string" || topic.trim() === "") {
        console.warn("⚠️ Skipping empty or invalid topic:", topic);
        continue;
      }

      console.log("🚀 Handling topic:", topic);

      // 🔹 Fetch news articles
      const newsRes = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: topic,
          apiKey: process.env.NEWS_API_KEY,
          sortBy: "publishedAt",
          pageSize: 3,
        },
      });

      const articles = newsRes.data.articles;

      for (const article of articles) {
        const rawText = article.description || article.content || article.title || "";
        const safeText = typeof rawText === "string" ? rawText.trim() : "(No content)";
        const summary = await summarize(safeText);

        allArticles.push({
          type: "news",
          title: article.title || "(No title)",
          source: article.source?.name || "Unknown source",
          summary,
          url: article.url || null,
          publishedAt: article.publishedAt || null,
        });
      }

      // 🔹 Fetch tweets (no summarization)
      try {
        console.log(`📡 Fetching tweets for topic: "${topic}"`);
        const tweets = await fetchTweets(topic);

        for (const tweet of tweets) {
          allArticles.push({
            type: "tweet",
            text: tweet.text || "(No text)",
            source: tweet.source || "unknown",
            url: tweet.url || null,
            reposts: tweet.reposts || 0,
            likes: tweet.likes || 0,
            replies: tweet.replies || 0,
            postedAt: tweet.postedAt || null,
          });
        }
      } catch (tweetErr) {
        console.error(`🚫 Error fetching tweets for "${topic}":`, tweetErr.message);
      }
    }

    res.json(allArticles);
  } catch (err) {
    console.error("❌ Error in /api/feed:", err.message);
    res.status(500).json({ error: "Something went wrong getting your feed." });
  }
});

module.exports = router;
