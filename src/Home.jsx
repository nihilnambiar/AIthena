import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import SplashScreen from "./SplashScreen.jsx";
import FloatingFeedbackButton from "./FloatingFeedbackButton.jsx";
import SEOHead from "./components/SEOHead.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartDreaming = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2000); // 2 seconds splash
  };

  const demoData = [
    {
      dream: "I was flying over a city of clouds...",
      interpretation:
        "This dream suggests a desire for freedom and a higher perspective on your life. Flying often symbolizes breaking free from limitations and seeing things from a new angle. You may be seeking escape from daily pressures or striving to rise above a current challenge.",
      mood: { label: "Peaceful", emoji: "🧘" },
    },
    {
      dream: "A cat whispered secrets to me in a forest...",
      interpretation:
        "You're reconnecting with past memories or unresolved issues. The cat represents intuition and mystery, while the forest is a symbol of the subconscious. This dream may be urging you to trust your instincts and explore hidden aspects of yourself.",
      mood: { label: "Weird", emoji: "👻" },
    },
    {
      dream: "I kept falling but never hit the ground...",
      interpretation:
        "You feel stuck in a cycle or unable to reach a resolution in some area of your life. Falling dreams often reflect anxiety or a lack of control. Your subconscious may be processing fears about failure or uncertainty about the future.",
      mood: { label: "Scary", emoji: "😱" },
    },
    {
      dream: "I was walking through a temple bathed in golden light...",
      interpretation:
        "You are searching for deeper meaning and spiritual connection in your life. The temple represents a sacred space, and the golden light suggests enlightenment or hope. This dream may be a sign to pursue inner peace and personal growth.",
      mood: { label: "Spiritual", emoji: "🕊️" },
    },
    {
      dream: "I saw my younger self in a mirror...",
      interpretation:
        "You're reflecting on your identity and childhood. Seeing your younger self can indicate a need to heal old wounds or reconnect with forgotten dreams. This dream encourages self-acceptance and understanding of your personal journey.",
      mood: { label: "Romantic", emoji: "💘" },
    },
    {
      dream: "There was a glowing key inside a dream library...",
      interpretation:
        "You're about to discover something powerful in yourself. The key symbolizes access to new knowledge or opportunities, while the library represents wisdom and learning. This dream suggests you are ready to unlock your potential and embrace new experiences.",
      mood: { label: "Confusing", emoji: "🤯" },
    },
    {
      dream: "I was lost in a city where everyone spoke a language I didn't understand...",
      interpretation:
        "This dream reflects feelings of isolation or being misunderstood in your waking life. The unfamiliar language symbolizes communication barriers or a struggle to express yourself. It may be time to seek new ways to connect with others or clarify your thoughts.",
      mood: { label: "Confusing", emoji: "🤯" },
    },
    {
      dream: "A staircase kept growing taller as I climbed...",
      interpretation:
        "You are facing ongoing challenges or ambitions that seem never-ending. The staircase represents progress and personal growth, but its endless nature may indicate frustration or a fear of never reaching your goals. Consider celebrating small victories along the way.",
      mood: { label: "Weird", emoji: "👻" },
    },
    {
      dream: "I was swimming with dolphins in crystal clear water...",
      interpretation:
        "This dream signifies harmony, joy, and emotional healing. Dolphins are symbols of playfulness and intelligence, and swimming with them suggests you are in tune with your emotions. It may be a reminder to embrace positivity and nurture your relationships.",
      mood: { label: "Peaceful", emoji: "🧘" },
    },
    {
      dream: "My house was floating in the sky, surrounded by stars...",
      interpretation:
        "You are seeking comfort and security while exploring new possibilities. The floating house represents your sense of self, and the stars symbolize hope and inspiration. This dream encourages you to dream big while staying grounded in your values.",
      mood: { label: "Spiritual", emoji: "🕊️" },
    },
  ];

  const [index, setIndex] = useState(0);
  const [typedDream, setTypedDream] = useState("");
  const [typedInterpretation, setTypedInterpretation] = useState("");

  // Ref to keep track of animation intervals and current demo
  const dreamIntervalRef = useRef();
  const interpIntervalRef = useRef();
  const cycleTimeoutRef = useRef();
  const currentDemoRef = useRef(demoData[0]);

  useEffect(() => {
    // Always use the latest demo
    currentDemoRef.current = demoData[index];
    // Clear any previous intervals/timeouts
    clearInterval(dreamIntervalRef.current);
    clearInterval(interpIntervalRef.current);
    clearTimeout(cycleTimeoutRef.current);
    setTypedDream("");
    setTypedInterpretation("");
    // Type dream
    let i = 1;
    dreamIntervalRef.current = setInterval(() => {
      const demo = currentDemoRef.current;
      setTypedDream(demo.dream.substring(0, i));
      i++;
      if (i > demo.dream.length) {
        clearInterval(dreamIntervalRef.current);
        // After a short pause, type interpretation
        cycleTimeoutRef.current = setTimeout(() => {
          let j = 1;
          interpIntervalRef.current = setInterval(() => {
            const demoInterp = currentDemoRef.current;
            setTypedInterpretation(demoInterp.interpretation.substring(0, j));
            j++;
            if (j > demoInterp.interpretation.length) {
              clearInterval(interpIntervalRef.current);
              // After a pause, cycle to next demo
              cycleTimeoutRef.current = setTimeout(() => {
                setIndex((prev) => (prev + 1) % demoData.length);
              }, 2000);
            }
          }, 30);
        }, 500);
      }
    }, 40);
    return () => {
      clearInterval(dreamIntervalRef.current);
      clearInterval(interpIntervalRef.current);
      clearTimeout(cycleTimeoutRef.current);
    };
    // eslint-disable-next-line
  }, [index]);

  if (loading) {
    return <SplashScreen />;
  }

  const demo = demoData[index];

  return (
    <>
      <SEOHead 
        title="DreamDive - AI-Powered Dream Journal & Interpretation App"
        description="Transform your dreams into insights with DreamDive. AI-powered dream journaling, interpretation, and analysis. Track your dreams, understand their meaning, and discover patterns in your subconscious mind."
        keywords="dream journal, dream interpretation, AI dreams, dream analysis, dream tracking, lucid dreaming, dream meaning, dream app, dream diary, subconscious mind, dream symbols, dream psychology"
        url="https://thedreamdive.com"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black text-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-2">🌙 DreamDive</h1>
            <p className="text-xl text-white/80 mb-2">Deep Dive Into Your Dreams</p>
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
              .shifting-gradient-border {
                position: relative;
                background: #5e3696;
                color: #f3f4f6;
                border-radius: 0.75rem;
                overflow: hidden;
                border: none;
              }
              .shifting-gradient-border::before {
                content: '';
                position: absolute;
                inset: -2px;
                z-index: 0;
                border-radius: 0.75rem;
                background: linear-gradient(90deg, #ff00cc, #333399, #ffcc00, #00ffcc, #ff00cc);
                background-size: 400%;
                animation: gradient-shift 4s linear infinite;
              }
              .shifting-gradient-border::after {
                content: '';
                position: absolute;
                inset: 2px;
                z-index: 1;
                border-radius: 0.65rem;
                background: #5e3696;
              }
              @keyframes gradient-shift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
            <button
              onClick={handleStartDreaming}
              className="relative px-6 py-3 text-lg font-semibold shifting-gradient-border"
            >
              <span className="relative z-10">Start Dreaming</span>
            </button>
          </div>

          <div className="mt-10 bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl max-w-2xl w-full">
            <p className="text-lg font-semibold text-white mb-2">Dream:</p>
            <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-base text-white min-h-[5rem] whitespace-pre-line text-lg">
              {typedDream}
            </div>
            <p className="text-lg font-semibold text-white mt-6">
              Mood: {demo ? `${demo.mood.emoji} ${demo.mood.label}` : ""}
            </p>
            <div className="p-4 mt-3 rounded-xl border-2 border-purple-400 bg-purple-600/40 text-white text-base min-h-[5rem] whitespace-pre-line text-lg">
              <span className="font-bold">Interpretation:</span> {typedInterpretation}
            </div>
          </div>
        </div>
        <FloatingFeedbackButton />
      </div>
    </>
  );
};

export default Home;
