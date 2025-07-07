import React from "react";
import { Link } from "react-router-dom";

export default function MoodBackgrounds() {
  const examples = [
    { mood: "Peaceful", bg: "from-blue-700 to-indigo-900", emoji: "🧘" },
    { mood: "Scary", bg: "from-red-700 to-gray-900", emoji: "👻" },
    { mood: "Romantic", bg: "from-pink-600 to-purple-800", emoji: "💘" },
    { mood: "Confusing", bg: "from-cyan-600 to-fuchsia-800", emoji: "🤯" },
    { mood: "Funny", bg: "from-yellow-400 to-orange-500", emoji: "😂" },
    { mood: "Spiritual", bg: "from-indigo-500 to-emerald-700", emoji: "🕊️" }, // New mood
  ];

  return (
    <div className="min-h-screen text-white px-6 py-16 bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="max-w-3xl mx-auto">
       
        <h1 className="text-4xl font-bold mb-4">Mood-Based Backgrounds</h1>
        <p className="text-purple-300 mb-6">
          Every dream is matched with a background that visually represents the emotional tone of the dream.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {examples.map((m) => (
            <div key={m.mood} className={`rounded-lg p-6 bg-gradient-to-br ${m.bg}`}>
              <h2 className="text-xl font-semibold mb-2">{m.emoji} {m.mood}</h2>
              <p className="text-white/80">
                This background helps you feel the vibe of the dream instantly.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
