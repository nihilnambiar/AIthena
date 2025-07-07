import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogo } from "./GoogleLogo";
import { auth, provider } from "./firebase";
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, getRedirectResult } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Handle Google sign-in redirect result
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        // No manual redirect here; rely on AuthContext and route logic
      })
      .catch((error) => {
        // Optionally handle errors
        console.error("Google redirect error:", error);
      });
  }, []);

  // Email/password login
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // No manual redirect here; rely on AuthContext and route logic
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  // Google OAuth login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // Always try popup first
      await signInWithPopup(auth, provider);
    } catch (popupErr) {
      // If popup fails (e.g., on mobile), fallback to redirect
      console.warn("Popup login failed, falling back to redirect:", popupErr);
      try {
        await signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        setError("Google login failed. Please try a different browser or disable incognito/private mode.");
        console.error("Google login failed:", redirectErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
      <form onSubmit={handleFormSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6">
        <h1 className="text-4xl text-center font-bold text-white">Login</h1>
        {error && <div className="text-red-400 text-center font-semibold">{error}</div>}
        <div>
          <label htmlFor="email" className="block text-white mb-2">Email</label>
          <input id="email" type="email" className="w-full p-3 rounded-xl bg-white/80 text-black focus:ring-2 focus:ring-purple-400" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} required />
        </div>
        <div>
          <label htmlFor="password" className="block text-white mb-2">Password</label>
          <div className="flex items-center gap-2">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded-xl bg-white/80 text-black focus:ring-2 focus:ring-purple-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="flex items-center justify-center p-2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye className="w-6 h-6 text-white" /> : <EyeOff className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl text-xl font-semibold text-white transition ${loading ? "bg-purple-300" : "bg-purple-600 hover:bg-purple-700"}`}>{loading ? "Loading..." : "Login"}</button>
        <button type="button" onClick={() => navigate('/signup')} disabled={loading} className="w-full py-2 mt-2 rounded-xl text-sm font-semibold text-white bg-white/20 hover:bg-white/30 transition">
          Don't have an account? Sign Up
        </button>
        <div className="text-center text-white/70"> or </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-xl font-semibold border border-black transition ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-200 text-black"}`}
        >
          <GoogleLogo className="w-6 h-6 align-middle" />
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
