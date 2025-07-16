import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, collection, getDocs } from "./firebase";
import FloatingFeedbackButton from "./FloatingFeedbackButton.jsx";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export default function SharedDreamLanding() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [dream, setDream] = useState(null);
  const [typedDream, setTypedDream] = useState("");
  const [typedInterp, setTypedInterp] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDream() {
      setLoading(true);
      setError("");
      setDream(null);
      try {
        // Search all users for the dream with this id
        const usersSnap = await getDocs(collection(db, "users"));
        let found = null;
        for (const userDoc of usersSnap.docs) {
          const dreamsSnap = await getDocs(collection(db, "users", userDoc.id, "dreams"));
          for (const dreamDoc of dreamsSnap.docs) {
            if (dreamDoc.id === id) {
              found = dreamDoc.data();
              break;
            }
          }
          if (found) break;
        }
        if (!found) {
          setError("Dream not found or is private.");
        } else {
          setDream(found);
        }
      } catch (e) {
        setError("Failed to load dream.");
      } finally {
        setLoading(false);
      }
    }
    fetchDream();
  }, [id]);

  useEffect(() => {
    if (!dream) return;
    setTypedDream("");
    setTypedInterp("");
    // Animate dream text
    let i = 1;
    const dreamText = dream.text || "";
    const interpText = dream.interpretation || "";
    const dreamInterval = setInterval(() => {
      setTypedDream(dreamText.substring(0, i));
      i++;
      if (i > dreamText.length) {
        clearInterval(dreamInterval);
        // After a short pause, animate interpretation
        setTimeout(() => {
          let j = 1;
          const interpInterval = setInterval(() => {
            setTypedInterp(interpText.substring(0, j));
            j++;
            if (j > interpText.length) {
              clearInterval(interpInterval);
            }
          }, 30);
        }, 500);
      }
    }, 40);
    return () => {
      clearInterval(dreamInterval);
    };
  }, [dream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-2">🌙 DreamDive</h1>
          <p className="text-xl text-white/80 mb-2">Deep Dive Into Your Dreams</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-10 bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-2xl w-full"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[10rem]">
              <svg className="animate-spin h-8 w-8 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span className="text-white/80">Loading dream...</span>
            </div>
          ) : error ? (
            <div className="text-red-300 text-lg font-semibold text-center min-h-[10rem]">{error}</div>
          ) : (
            <>
              <p className="text-lg font-semibold text-white mb-2">Dream:</p>
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-base text-white min-h-[5rem] whitespace-pre-line text-lg">
                {typedDream}
              </div>
              <p className="text-lg font-semibold text-white mt-6">
                Mood: {dream.moodEmoji ? `${dream.moodEmoji} ` : ''}{dream.mood || "Unknown"}
              </p>
              <div className="p-4 mt-3 rounded-xl border-2 border-purple-400 bg-purple-600/40 text-white text-base min-h-[5rem] whitespace-pre-line text-lg">
                <span className="font-bold">Interpretation:</span> {typedInterp}
              </div>
              <div className="flex justify-center mt-6">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition shadow"
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copied!" : "Copy Share Link"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
      <FloatingFeedbackButton />
    </div>
  );
} 