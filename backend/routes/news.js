import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query =
      '("Artificial Intelligence" OR AI OR "Quantum Computing" OR Technology OR FinTech OR "Stock Market" OR Sensex OR Nifty OR Gold OR Silver)';

    const url =
      "https://newsapi.org/v2/everything?" +
      new URLSearchParams({
        q: query,
        language: "en",
        sortBy: "publishedAt",
        pageSize: "20",
        apiKey: process.env.NEWS_API_KEY
      });

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "ok") {
      console.error("NewsAPI error:", data);
      return res.status(500).json({ error: data.message });
    }

    res.json({ articles: data.articles });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
