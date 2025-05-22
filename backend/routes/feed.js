console.log("📦 feed.js loaded");
const express = require("express");
const router = express.Router();
const summarize = require("../services/summarize");
const axios = require("axios");

router.post("/", async (req, res) => {
  console.log("✅ /api/feed hit"); // Confirm it's triggered

  const { interests } = req.body;
  const allArticles = [];

  try {
    for (const topic of interests) {
      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: topic,
          apiKey: process.env.NEWS_API_KEY,
          sortBy: "publishedAt",
          pageSize: 3,
        },
      });

      const articles = response.data.articles;

      for (const article of articles) {
        const summary = await summarize(article.description || article.content || article.title);
        allArticles.push({
          title: article.title,
          url: article.url,
          source: article.source.name,
          summary,
        });
      }
    }

    res.json(allArticles);
  } catch (err) {
    console.error("Error in /api/feed:", err.message);
    res.status(500).json({ error: "Something went wrong getting your feed." });
  }
});

module.exports = router;
