import React from "react";
import { Link } from "react-router-dom";

export default function AnimatedTextStreaks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white px-6 py-16">
     
      <p className="text-purple-300 mb-6">
        Watch your dream type itself out as if it's unfolding in real time — immersive & magical!
      </p>
      <div className="font-mono bg-white/10 rounded-lg p-6 border border-purple-500 animate-pulse text-purple-200">
        I was walking endlessly in a foggy hallway...
      </div>
    </div>
  );
}
