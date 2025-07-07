import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogo } from "./GoogleLogo";

const SignUpPage = ({ setUser = () => {} }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Email/password signup
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userObj = userCredential.user;
      await setDoc(doc(db, "users", userObj.uid), {
        uid: userObj.uid,
        name: userObj.email,
        email: userObj.email,
        photo: userObj.photoURL || "",
        isPremium: false,
      });
      const userData = { uid: userObj.uid, name: userObj.email, email: userObj.email, photo: userObj.photoURL || "" };
      setUser(userData);
      localStorage.setItem("dreamUser", JSON.stringify(userData));
      navigate("/dream");
    } catch (err) {
      alert("❌ Signup failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSignUp();
  }

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 animate-login-gradient bg-gradient-to-br from-blue-500 via-purple-500 to-teal-400" />
      {/* Aurora effect */}
      <div className="absolute left-1/2 top-1/3 w-[90vw] h-56 -translate-x-1/2 bg-gradient-to-r from-teal-200 via-blue-400 to-purple-400 opacity-40 blur-3xl animate-login-aurora" />
      <div className="absolute left-1/3 top-1/2 w-[60vw] h-32 -translate-x-1/2 bg-gradient-to-r from-purple-300 via-blue-300 to-teal-200 opacity-30 blur-2xl animate-login-aurora2" />
      <style>{`
        @keyframes login-gradient {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(30deg) brightness(1.1); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        .animate-login-gradient {
          animation: login-gradient 16s ease-in-out infinite;
        }
        @keyframes login-aurora {
          0%, 100% { transform: translateX(-50%) scaleY(1) skewX(-8deg); opacity: 0.4; }
          50% { transform: translateX(-48%) scaleY(1.2) skewX(-12deg); opacity: 0.6; }
        }
        .animate-login-aurora {
          animation: login-aurora 12s ease-in-out infinite;
        }
        @keyframes login-aurora2 {
          0%, 100% { transform: translateX(-50%) scaleY(1) skewX(8deg); opacity: 0.3; }
          50% { transform: translateX(-52%) scaleY(1.1) skewX(12deg); opacity: 0.5; }
        }
        .animate-login-aurora2 {
          animation: login-aurora2 18s ease-in-out infinite;
        }
      `}</style>
      <form onSubmit={handleFormSubmit} className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6">
        <h1 className="text-4xl text-center font-bold text-white">Sign Up</h1>
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
        <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl text-xl font-semibold text-white transition ${loading ? "bg-purple-300" : "bg-purple-600 hover:bg-purple-700"}`}>{loading ? "Loading..." : "Sign Up"}</button>
        <button type="button" onClick={() => navigate('/login')} disabled={loading} className="w-full py-2 mt-2 rounded-xl text-sm font-semibold text-white bg-white/20 hover:bg-white/30 transition">
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default SignUpPage; 