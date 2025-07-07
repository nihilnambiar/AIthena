import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();
  const containerRef = useRef();

  const handleBackgroundClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      navigate(-1);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white px-4 py-16 flex items-center justify-center relative"
      onClick={handleBackgroundClick}
      style={{ cursor: "pointer" }}
    >
      <div
        ref={containerRef}
        className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        style={{ cursor: "auto" }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information Collection</h2>
        <ul className="list-disc list-inside mb-4 text-white/90">
          <li>We collect personal data, such as email addresses, for account creation and communication purposes.</li>
          <li>We use cookies and similar technologies to improve user experience.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How Your Information is Used</h2>
        <ul className="list-disc list-inside mb-4 text-white/90">
          <li>To provide and improve our services.</li>
          <li>To communicate updates or promotional offers.</li>
          <li>To analyze trends and improve functionality.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Sharing</h2>
        <ul className="list-disc list-inside mb-4 text-white/90">
          <li>Your data is never sold.</li>
          <li>Some data may be shared with trusted third-party providers to improve our services (e.g., payment processors, analytics tools).</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Data Security</h2>
        <ul className="list-disc list-inside mb-4 text-white/90">
          <li>We use encryption and other security measures to protect your data.</li>
          <li>However, no system is 100% secure; use the service at your own risk.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">User Rights</h2>
        <ul className="list-disc list-inside mb-4 text-white/90">
          <li>You can request access to your data or delete your account at any time.</li>
          <li>Contact us for privacy-related concerns at <a href="mailto:nihil@thedreamdive.com" className="underline hover:text-white/80">nihil@thedreamdive.com</a>.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to Privacy Policy</h2>
        <p className="mb-4">We may update the policy periodically. We recommend reviewing it regularly.</p>
      </div>
    </div>
  );
} 