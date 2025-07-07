const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");
const axios = require("axios");
const { Groq } = require('groq-sdk');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log("Loaded GROQ_API_KEY:", process.env.GROQ_API_KEY ? "[HIDDEN]" : "undefined");

// Robust CORS for dev
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.options('*', cors());

app.use(bodyParser.json());

app.post("/interpret", async (req, res) => {
  const { dream, mood, isDetailed } = req.body;

  if (!dream) {
    return res.status(400).json({ error: "Dream is required." });
  }

  try {
    console.log("Calling Groq with key:", process.env.GROQ_API_KEY ? "[HIDDEN]" : "undefined");
    let prompt;
    let systemMessage = undefined;
    if (isDetailed) {
      prompt = `You are a friendly, supportive dream analyst. Analyze this dream: "${dream}" and provide a detailed, positive, and mood-matching interpretation. The user's mood is: "${mood}". Structure your response with:\n\n1. Key symbols and their meanings\n2. Emotional trends and connections to the mood\n3. Supportive, actionable advice\n\nBe empathetic, concise, and uplifting.`;
      systemMessage = undefined;
    } else {
      prompt = `Analyze this dream: "${dream}" and provide a strictly short (1-2 sentences), friendly, and mood-matching interpretation that is apt for the user's mood: "${mood}". DO NOT provide more than 2 sentences. DO NOT use lists, sections, or bullet points. Be concise, positive, and empathetic.`;
      systemMessage = "You are a friendly, concise dream interpreter. Your response must be strictly 1-2 sentences, never more. Do not use lists, sections, or bullet points. Be brief, positive, and match the user's mood.";
    }
    const messages = [
      ...(systemMessage ? [{ role: "system", content: systemMessage }] : []),
      { role: "user", content: prompt }
    ];
    // Log prompt and system message for debugging
    console.log("Prompt sent to Groq:", prompt);
    if (systemMessage) console.log("System message:", systemMessage);
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: isDetailed ? 8192 : 256,
      top_p: 1,
      stream: false,
      stop: null
    });
    let output = chatCompletion.choices[0]?.message?.content?.trim() || "";
    // Post-process: truncate to 2 sentences for non-premium
    if (!isDetailed) {
      const sentences = output.match(/[^.!?]+[.!?]+/g) || [];
      output = sentences.slice(0, 2).join(" ").trim();
    }
    console.log("[PROMPT SENT]", prompt);
    console.log("[SYSTEM MESSAGE]", systemMessage);
    console.log("[LLM OUTPUT]", output);

    const interpretation = output;
    res.json({ interpretation });
  } catch (error) {
    console.error("Groq SDK Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong while interpreting your dream." });
  }
});

// New endpoint for premium community features
app.post("/api/community/post", async (req, res) => {
  const { content, userId, author } = req.body;
  
  if (!content || !userId || !author) {
    return res.status(400).json({ error: "Content, userId, and author are required." });
  }

  try {
    // In a real implementation, you'd save to a database
    // For now, we'll just return success
    res.json({ 
      success: true, 
      post: {
        id: Date.now(),
        content,
        author,
        userId,
        timestamp: new Date(),
        likes: 0,
        comments: 0
      }
    });
  } catch (error) {
    console.error("Community post error:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
});

// New endpoint for dream sharing analytics
app.post("/api/share-analytics", async (req, res) => {
  const { dreamId, platform, userId } = req.body;
  
  try {
    // In a real implementation, you'd track sharing analytics
    console.log(`Dream ${dreamId} shared on ${platform} by user ${userId}`);
    res.json({ success: true });
  } catch (error) {
    console.error("Share analytics error:", error);
    res.status(500).json({ error: "Failed to track share." });
  }
});

app.post("/api/feedback", async (req, res) => {
  const { feedback } = req.body;
  if (!feedback || typeof feedback !== "string" || !feedback.trim()) {
    return res.status(400).json({ error: "Feedback is required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `DreamDive Feedback <${process.env.SMTP_USER}>`,
      to: "get2nihil@gmail.com",
      subject: "New DreamDive Feedback",
      text: feedback,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Feedback email error:", err);
    res.status(500).json({ error: "Failed to send feedback." });
  }
});

// --- Rule-based dream interpretation ---
const dreamSymbolMap = {
  flying: "Dreams of flying often symbolize a desire for freedom or escape from limitations.",
  cat: "Cats in dreams can represent intuition, independence, or feminine energy.",
  water: "Water often symbolizes emotions, the subconscious, or a need for cleansing.",
  falling: "Falling dreams may reflect anxiety, loss of control, or fear of failure.",
  mirror: "Mirrors can symbolize self-reflection, identity, or seeing yourself clearly.",
  key: "A key in a dream may represent access to new opportunities or unlocking hidden potential.",
  library: "A library can symbolize knowledge, wisdom, or a search for answers.",
  snake: "Snakes often represent transformation, hidden fears, or healing.",
  baby: "Babies can symbolize new beginnings, innocence, or vulnerability.",
  teeth: "Losing teeth in dreams may reflect concerns about appearance or powerlessness."
};

function ruleBasedInterpretation(dream) {
  const found = [];
  const lowerDream = dream.toLowerCase();
  for (const symbol in dreamSymbolMap) {
    if (lowerDream.includes(symbol)) {
      found.push(dreamSymbolMap[symbol]);
    }
  }
  if (found.length === 0) {
    return "No common dream symbols found. Your dream is unique! Try to reflect on your feelings and recent experiences.";
  }
  return found.join("\n\n");
}

app.post("/interpret-rulebased", (req, res) => {
  const { dream } = req.body;
  if (!dream) {
    return res.status(400).json({ error: "Dream is required." });
  }
  const interpretation = ruleBasedInterpretation(dream);
  res.json({ interpretation });
});

app.listen(PORT, () => {
  console.log(`✅ DreamDive Gemini backend running on port ${PORT}`);
});
