import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
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
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
        <h2 className="text-xl font-semibold mt-6 mb-2">Acceptance of Terms</h2>
        <p className="mb-4">By using DreamDive, you agree to these terms. If you do not agree, you may not use our services.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Use of the Service</h2>
        <ul className="list-disc list-inside mb-4 text-white/90">
          <li>You are responsible for maintaining the security of your account credentials.</li>
          <li>Any content generated using DreamDive is for personal use and should not violate any laws.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Content Ownership</h2>
        <ul className="list-disc list-inside mb-4 text-white/90">
          <li>All AI-generated content remains your property, but we retain the right to use anonymized data to improve the service.</li>
          <li>You may not use the platform for malicious or harmful purposes.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Modification of Services</h2>
        <p className="mb-4">DreamDive may modify the service at any time. If we ever plan to discontinue the service, we will provide advance notice to users.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <p className="mb-4">DreamDive is not responsible for any loss or damage resulting from your use of the service.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Changes to Terms</h2>
        <p className="mb-4">We may update these terms periodically. Continued use of the service implies acceptance of the updated terms.</p>
      </div>
    </div>
  );
} 