// server.js
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(".")); // serves index.html/style.css/script.js

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY. Create a .env file with OPENAI_API_KEY=your_key"
      });
    }

    const { messages, temperature } = req.body || {};
    if (!Array.isArray(messages) || typeof temperature !== "number") {
      return res.status(400).json({
        error: "Bad request. Expected { messages: [...], temperature: number }"
      });
    }

    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature,
        messages
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || "OpenAI request failed",
        details: data
      });
    }

    const text = data?.choices?.[0]?.message?.content ?? "";
    return res.json({ text });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Prompt Proxy running at http://localhost:${PORT}`);
});
