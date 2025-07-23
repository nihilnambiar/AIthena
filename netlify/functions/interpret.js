const { Groq } = require('groq-sdk');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Check if API key is available
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured. Please contact support.' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const { dream, mood, isDetailed } = body;
  if (!dream) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Dream is required.' })
    };
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
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
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ interpretation: output })
    };
  } catch (error) {
    console.error("Groq SDK Error:", error.response?.data || error.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: "Something went wrong while interpreting your dream. Please try again." })
    };
  }
}; 