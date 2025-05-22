const express = require("express");
const cors = require("cors");
require("dotenv").config();

const feedRoutes = require("./routes/feed");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Main API Route
app.use("/api/feed", feedRoutes);

// ✅ Quick GET test
app.get("/", (req, res) => {
  res.send("🎉 Culture Feed Backend is running!");
});

// ✅ POST test route
app.post("/test", (req, res) => {
  console.log("🔥 POST /test hit");
  res.json({ message: "POST /test is working" });
});

// ❌ MOVE THIS TO THE BOTTOM
app.use((req, res) => {
  res.status(404).send("🔍 Route not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
