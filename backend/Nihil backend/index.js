require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API endpoint for text generation
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'API request failed',
      details: error.response?.data || error.message 
    });
  }
});

// Add /interpret endpoint for dream interpretation
app.post('/interpret', async (req, res) => {
  const { dream, mood } = req.body;

  if (!dream) {
    return res.status(400).json({ error: 'Dream is required.' });
  }

  try {
    // Compose prompt with mood
    const prompt = `You are a dream interpreter. Analyze the following dream: "${dream}" and provide a meaningful, concise interpretation (2-3 sentences) considering the user's mood: "${mood}".`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }
    );

    const interpretation = response.data.candidates[0].content.parts[0].text;
    res.json({ interpretation });
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong while interpreting your dream." });
  }
});

// Add DALL·E image generation endpoint
app.post('/api/generate-image', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const openaiRes = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt,
      n: 1,
      size: "512x512"
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    });
    const data = openaiRes.data;
    if (data.data && data.data[0] && data.data[0].url) {
      res.json({ url: data.data[0].url });
    } else {
      res.status(500).json({ error: data.error?.message || "Image generation failed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error: " + (err.response?.data?.error?.message || err.message) });
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const result = await genAI.listModels();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});