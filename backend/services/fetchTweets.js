const axios = require("axios");

const fetchTweets = async (topic) => {
  try {
    console.log(`📡 Fetching tweets for topic: ${topic}`);
    const response = await axios.get("https://twitter241.p.rapidapi.com/search", {
      params: {
        q: topic,
        lang: "en",
        limit: 5,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "twitter241.p.rapidapi.com",
      },
    });

    const rawTweets = response.data?.results || [];

    return rawTweets.map((tweet) => {
      const user = tweet.user || {};
      const username = user.username || user.screen_name || "unknown";
      const tweetId = tweet.id || tweet.id_str || "0";

      return {
        type: "tweet",
        text: typeof tweet.text === "string" ? tweet.text : "(No text)",
        source: `@${username}`,
        url: `https://twitter.com/${username}/status/${tweetId}`,
        reposts: tweet.retweet_count || 0,
        likes: tweet.favorite_count || 0,
        replies: tweet.reply_count || 0,
        postedAt: tweet.date || tweet.created_at || null,
      };
    });
  } catch (err) {
    console.error("❌ RapidAPI tweet fetch error:", err.response?.data || err.message);
    return [];
  }
};

module.exports = fetchTweets;
