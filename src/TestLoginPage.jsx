// src/TestLoginPage.jsx
import React, { useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

const TestLoginPage = () => {
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        console.log("🔁 Checking redirect result...");
        const result = await getRedirectResult(auth);
        console.log("🔁 Firebase redirect result:", result);

        if (result?.user) {
          alert("✅ Redirect login success: " + result.user.displayName);
        } else {
          alert("⚠️ No user returned from redirect.");
        }
      } catch (err) {
        console.error("❌ Redirect error:", err);
        alert("❌ Redirect failed: " + err.message);
      }
    };
    checkRedirectResult();
  }, []);

  const handleLogin = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      alert("Login button clicked ✅");

      if (isMobile) {
        alert("📱 Mobile detected — using redirect");
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        alert("🖥️ Popup login success: " + result.user.displayName);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("❌ Login error: " + error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100">
      <h1 className="text-2xl font-bold mb-4">🧪 Firebase Login Test</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default TestLoginPage;
