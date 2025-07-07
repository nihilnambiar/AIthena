import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBCnWn_uOhfg6OW6KepPeH4eB41DbgvONQ" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "what is the capital of France?",
  });
  console.log(response.text);
}

main();