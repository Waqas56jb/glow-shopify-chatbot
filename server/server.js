require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { buildSystemPrompt } = require("./prompt");

const PORT = 5000;
const MODEL = "gpt-4o-mini";
const MAX_TOKENS = 1024;
const TEMPERATURE = 0.7;
const SYSTEM_PROMPT = buildSystemPrompt();

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "*",
  methods: ["GET", "POST"],
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const systemMessage = { role: "system", content: SYSTEM_PROMPT };
    const hasSystemMessage = messages[0]?.role === "system";
    const finalMessages = hasSystemMessage
      ? [systemMessage, ...messages.slice(1)]
      : [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: finalMessages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    const reply = completion.choices[0]?.message?.content || "";

    res.json({
      reply,
      model: MODEL,
    });
  } catch (error) {
    console.error("Chat API error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to get response from OpenAI",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
