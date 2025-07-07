import React from "react";
import { Link } from "react-router-dom";

export default function ShareableInsights() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Shareable Insights</h1>
      <p className="text-purple-300 mb-6">
        Easily share your dream with friends or save the interpretation to your journal.
      </p>
      <div className="bg-white/10 p-6 rounded-lg text-white/80">📤 Coming soon: image + text sharing UI</div>
    </div>
  );
}
