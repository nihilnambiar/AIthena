const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt;
    
    if (isDetailed) {
      // Advanced analysis for premium users
      prompt = `You are an expert dream analyst with deep knowledge of psychology, symbolism, and Jungian archetypes. Provide a comprehensive analysis of this dream: "${dream}" considering the user's mood: "${mood}".

Please structure your response with the following sections:

1. **SYMBOLISM ANALYSIS** (2-3 paragraphs)
   - Identify key symbols, objects, colors, and actions
   - Explain their psychological and cultural meanings
   - Connect symbols to universal archetypes

2. **EMOTIONAL TREND ANALYSIS** (2-3 paragraphs)
   - Analyze the emotional undertones and patterns
   - Connect to the user's current mood and life circumstances
   - Identify recurring emotional themes

3. **PSYCHOLOGICAL INTERPRETATION** (2-3 paragraphs)
   - Deep dive into subconscious messages
   - Explore potential unresolved issues or desires
   - Connect to personal growth opportunities

4. **REAL-LIFE CONNECTIONS** (1-2 paragraphs)
   - Suggest possible connections to waking life
   - Identify patterns or situations that might be reflected

5. **ACTIONABLE INSIGHTS** (1-2 paragraphs)
   - Provide practical advice or next steps
   - Suggest areas for self-reflection or growth
   - Offer positive affirmations or mindset shifts

Make the analysis insightful, compassionate, and empowering. Use clear language while maintaining depth.`;
    } else {
      // Basic analysis for free users
      prompt = `You are a dream interpreter. Analyze the following dream: "${dream}" and provide a meaningful interpretation considering the user's mood: "${mood}". Keep it concise but insightful, focusing on the main themes and possible meanings.`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const interpretation = response.text();

    res.json({ interpretation });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
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
