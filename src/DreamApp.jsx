import React, { useState, useEffect, useRef } from "react";
import { db, collection, addDoc, serverTimestamp, getDocs, orderBy, query, doc, deleteDoc, onSnapshot } from "./firebase";
import { useAuth } from "./AuthContext";
import FloatingFeedbackButton from "./FloatingFeedbackButton.jsx";
import { LegalFooter } from "./LegalFooter";
import SideDrawer from "./SideDrawer.jsx";
import DreamJournal from "./DreamJournal.jsx";
import { X, Share2, Trash2, Users, ChevronDown, Smile, CloudSun, Ghost, Heart, Laugh, Meh, Frown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MoodBackgrounds from './MoodBackgrounds';
import PremiumCommunity from "./PremiumCommunity";
import DreamShareCard from "./DreamShareCard";
import Modal from "./components/Modal";

const moodIcons = {
  Peaceful: CloudSun,
  Scary: Frown,
  Romantic: Heart,
  Confusing: Meh,
  Funny: Laugh,
  Weird: Ghost,
  Spiritual: Sparkles,
};

const moods = [
  { label: "Peaceful", icon: CloudSun },
  { label: "Scary", icon: Frown },
  { label: "Romantic", icon: Heart },
  { label: "Confusing", icon: Meh },
  { label: "Funny", icon: Laugh },
  { label: "Weird", icon: Ghost },
  { label: "Spiritual", icon: Sparkles },
];

const moodBackgrounds = {
  Peaceful: {
    style: {
      background: 'linear-gradient(120deg, #7fd7f7 0%, #6bb6e6 40%, #7e8cf7 100%)',
    },
    className: 'animate-mood-peaceful',
    emojis: ['🧘', '☁️', '🌊'], // reduced
  },
  Weird: {
    style: {
      background: 'linear-gradient(120deg, #c6e26b 0%, #b97fd7 50%, #7e8cf7 100%)',
    },
    className: 'animate-mood-weird',
    emojis: ['👽', '🦄', '💫'], // reduced
  },
  Scary: {
    style: {
      background: 'linear-gradient(120deg, #2b2323 0%, #a32c2c 60%, #000 100%)',
    },
    className: 'animate-mood-scary',
    emojis: ['👻', '🕷️', '☠️'], // reduced
  },
  Romantic: {
    style: {
      background: 'linear-gradient(120deg, #e14fa1 0%, #a32c8c 100%)',
    },
    className: 'animate-mood-romantic',
    emojis: ['💘', '🌹', '💖'], // reduced
  },
  Confusing: {
    style: {
      background: 'linear-gradient(120deg, #000 0%, #1a1a1a 60%, #7e8cf7 100%)',
    },
    className: 'animate-mood-confusing',
    emojis: ['🤯', '❓', '💭'], // reduced
  },
  Funny: {
    style: {
      background: 'linear-gradient(120deg, #ffe29f 0%, #ffb6b6 100%)',
    },
    className: 'animate-mood-funny',
    emojis: ['😂', '🤡', '🎉'], // reduced
  },
  Spiritual: {
    style: {
      background: 'linear-gradient(120deg, #3fd7e6 0%, #7e8cf7 100%)',
    },
    className: 'animate-mood-spiritual',
    emojis: ['🕊️', '✨', '🌙'], // reduced
  },
};

function MatrixRain({ show }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = '01';
    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = fontSize + 'px monospace';
      ctx.fillStyle = '#00FF41';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [show]);
  return show ? (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none" style={{opacity:0.7}} />
  ) : null;
}

// Scary background effect for 'Scary' mood
function ScaryBackground({ show }) {
  // Animated fog and clouds using canvas
  const fogRef = useRef(null);
  const cloudsRef = useRef(null);
  // Eyes state
  const [eyes, setEyes] = useState([]);
  useEffect(() => {
    if (!show) return;
    // Fog animation
    const canvas = fogRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    let fogParticles = Array.from({length: 18}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 80 + Math.random() * 80,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: 0.10 + Math.random() * 0.13
    }));
    let animationFrameId;
    function drawFog() {
      ctx.clearRect(0, 0, width, height);
      for (let p of fogParticles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(180,180,200,${p.opacity})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 40;
        ctx.fill();
        ctx.shadowBlur = 0;
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;
      }
      animationFrameId = requestAnimationFrame(drawFog);
    }
    drawFog();
    return () => cancelAnimationFrame(animationFrameId);
  }, [show]);

  // Clouds animation
  useEffect(() => {
    if (!show) return;
    const canvas = cloudsRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    // Cloud objects
    let clouds = Array.from({length: 7}, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7),
      r: 60 + Math.random() * 120,
      speed: 0.12 + Math.random() * 0.18,
      opacity: 0.13 + Math.random() * 0.18
    }));
    let animationFrameId;
    function drawClouds() {
      ctx.clearRect(0, 0, width, height);
      for (let c of clouds) {
        // Draw a cloud as several overlapping ellipses
        ctx.save();
        ctx.globalAlpha = c.opacity;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.r, c.r * 0.55, 0, 0, 2 * Math.PI);
        ctx.ellipse(c.x + c.r * 0.5, c.y + c.r * 0.1, c.r * 0.7, c.r * 0.4, 0, 0, 2 * Math.PI);
        ctx.ellipse(c.x - c.r * 0.4, c.y + c.r * 0.18, c.r * 0.5, c.r * 0.3, 0, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(30,30,30,0.95)';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 32;
        ctx.fill();
        ctx.restore();
        c.x += c.speed;
        if (c.x - c.r > width) {
          c.x = -c.r;
          c.y = Math.random() * (height * 0.7);
        }
      }
      animationFrameId = requestAnimationFrame(drawClouds);
    }
    drawClouds();
    return () => cancelAnimationFrame(animationFrameId);
  }, [show]);

  // Eyes logic
  useEffect(() => {
    if (!show) return;
    let timeout;
    function spawnEyes() {
      setEyes(eyes => [
        ...eyes,
        {
          id: Math.random().toString(36).slice(2),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          size: 28 + Math.random() * 18,
        }
      ]);
      timeout = setTimeout(spawnEyes, 2200 + Math.random() * 3000);
    }
    spawnEyes();
    return () => clearTimeout(timeout);
  }, [show]);
  // Remove eyes after a while
  useEffect(() => {
    if (!show) return;
    if (eyes.length === 0) return;
    const timeout = setTimeout(() => {
      setEyes(eyes => eyes.slice(1));
    }, 1800);
    return () => clearTimeout(timeout);
  }, [eyes, show]);

  // Flickering shadow shapes
  const shadowShapes = Array.from({length: 4}, (_,i) => (
    <div key={i} className="fixed z-0 pointer-events-none select-none" style={{
      left: `${10 + i*20 + Math.random()*8}%`,
      top: `${30 + Math.random()*30}%`,
      width: `${120 + Math.random()*60}px`,
      height: `${80 + Math.random()*40}px`,
      background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.09) 80%, transparent 100%)',
      filter: `blur(${8 + Math.random()*8}px) brightness(0.7)`,
      opacity: 0.7 + Math.random()*0.2,
      animation: `flicker-shadow 2.${i+1}s infinite alternate`,
    }} />
  ));

  return show ? (
    <>
      {/* Clouds */}
      <canvas ref={cloudsRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none" style={{opacity:0.55}} />
      {/* Fog */}
      <canvas ref={fogRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none select-none" style={{opacity:0.45}} />
      {/* Flickering shadows */}
      {shadowShapes}
      {/* Glowing eyes */}
      {eyes.map(eye => (
        <div key={eye.id} className="fixed z-0 pointer-events-none select-none" style={{
          left: `${eye.x}%`,
          top: `${eye.y}%`,
          width: eye.size*2,
          height: eye.size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: 0.85,
          filter: 'drop-shadow(0 0 8px #f00)',
          transition: 'opacity 0.7s',
        }}>
          <span style={{
            display: 'inline-block',
            width: eye.size,
            height: eye.size*0.7,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 60%, #f00 60%, #fff 100%)',
            boxShadow: '0 0 16px 4px #f00',
          }} />
          <span style={{
            display: 'inline-block',
            width: eye.size,
            height: eye.size*0.7,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 60%, #f00 60%, #fff 100%)',
            boxShadow: '0 0 16px 4px #f00',
          }} />
        </div>
      ))}
      {/* Vignette overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 70%, transparent 100%)',
        mixBlendMode: 'multiply',
        opacity: 0.7,
      }} />
      {/* Red tint overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none" style={{
        background: 'linear-gradient(120deg, rgba(120,0,0,0.13) 0%, rgba(255,0,0,0.09) 100%)',
        opacity: 0.5,
      }} />
      <style>{`
        @keyframes flicker-shadow {
          0% { opacity: 0.7; filter: blur(10px) brightness(0.7); }
          50% { opacity: 0.95; filter: blur(16px) brightness(0.9); }
          100% { opacity: 0.7; filter: blur(10px) brightness(0.7); }
        }
      `}</style>
    </>
  ) : null;
}

export default function DreamApp() {
  const { user, logout } = useAuth();
  const [dream, setDream] = useState("");
  const [mood, setMood] = useState(moods[0].label);
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dreams, setDreams] = useState([]);
  const [journalLoading, setJournalLoading] = useState(false);
  // Set drawerOpen default based on screen width (closed on mobile, open on desktop)
  const [drawerOpen, setDrawerOpen] = useState(() => window.innerWidth > 768);
  const [selectedDream, setSelectedDream] = useState(null);
  const [showCommunity, setShowCommunity] = useState(false);
  const [moodOpen, setMoodOpen] = useState(false);
  const [emojiAnimKey, setEmojiAnimKey] = useState(0);
  const [bgEmojiKey, setBgEmojiKey] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [shareCardDream, setShareCardDream] = useState(null);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  const [detailedInterpretation, setDetailedInterpretation] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dreamToDelete, setDreamToDelete] = useState(null);
  // Store the last interpreted dream and mood
  const [lastDream, setLastDream] = useState("");
  const [lastMood, setLastMood] = useState("");
  const [showSaveAnim, setShowSaveAnim] = useState(false);
  const [animStart, setAnimStart] = useState({ x: 0, y: 0 });
  const [animEnd, setAnimEnd] = useState({ x: 0, y: 0 });
  const interpretationRef = useRef();
  const journalIconRef = useRef();

  useEffect(() => {
    if (!user?.uid) return;
    setJournalLoading(true);
    // Use Firestore real-time updates
    const dreamsRef = collection(db, "users", user.uid, "dreams");
    const q = query(dreamsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setDreams(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setJournalLoading(false);
    }, (err) => {
      setError("Failed to load dream journal.");
      setJournalLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    // When mood changes, update background emoji key to force re-render
    setBgEmojiKey(k => k + 1);
  }, [mood]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Animation: get bounding rects and trigger immediately
    setTimeout(() => {
      if (interpretationRef.current && journalIconRef.current) {
        const startRect = interpretationRef.current.getBoundingClientRect();
        const endRect = journalIconRef.current.getBoundingClientRect();
        setAnimStart({ x: startRect.left + startRect.width / 2, y: startRect.top + startRect.height / 2 });
        setAnimEnd({ x: endRect.left + endRect.width / 2, y: endRect.top + endRect.height / 2 });
        setShowSaveAnim(true);
      }
    }, 100); // slight delay to ensure DOM update
    setLoading(true);
    setError("");
    setInterpretation("");
    setDetailedInterpretation(""); // Clear detailed interpretation on new dream
    try {
      // Always request short interpretation for initial submit
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream, mood, isDetailed: false })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to interpret dream");
      setInterpretation(data.interpretation);
      setLastDream(dream);
      setLastMood(mood);
      // Save to Firestore
      if (user?.uid) {
        await addDoc(collection(db, "users", user.uid, "dreams"), {
          text: dream,
          mood,
          interpretation: data.interpretation,
          createdAt: serverTimestamp(),
          isDetailed: false
        });
      }
    } catch (e) {
      setError(e.message || "Failed to interpret dream");
    } finally {
      setLoading(false);
    }
  };

  const handleShareDream = (dream) => {
    setShareCardDream(dream);
    setShowShareCard(true);
  };

  const handleDeleteDream = async (dream) => {
    setDreamToDelete(dream);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDream = async () => {
    try {
      if (user?.uid && dreamToDelete?.id) {
        await deleteDoc(doc(db, "users", user.uid, "dreams", dreamToDelete.id));
        setDreams(dreams => dreams.filter(d => d.id !== dreamToDelete.id));
      }
      setSelectedDream(null);
    } catch (e) {
      setError("Failed to delete dream. Please try again.");
    } finally {
      setShowDeleteConfirm(false);
      setDreamToDelete(null);
    }
  };

  const handleDetailedAnalysis = async () => {
    if (!user?.premium) {
      setShowPremiumPrompt(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Use last interpreted dream and mood
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream: lastDream, mood: lastMood, isDetailed: true })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get detailed analysis");
      setDetailedInterpretation(data.interpretation);
    } catch (e) {
      setError(e.message || "Failed to get detailed analysis");
    } finally {
      setLoading(false);
    }
  };

  const currentMood = moods.find(m => m.label === mood);
  const bg = moodBackgrounds[mood] || moodBackgrounds.Peaceful;

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <MoodBackgrounds mood={mood} />
      {/* SideDrawer and overlay */}
      {drawerOpen && (
        <>
          {/* Overlay: clicking it closes the drawer */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
          <SideDrawer
            user={user}
            dreams={dreams}
            onClose={() => setDrawerOpen(false)}
            onLogout={(e) => {
              if (e) e.stopPropagation();
              setShowLogoutConfirm(true);
            }}
            onDreamClick={dream => setSelectedDream(dream)}
            isPremium={!!user?.premium}
            onCommunity={() => setShowCommunity(true)}
            journalIconRef={journalIconRef}
          />
        </>
      )}
      {/* Share Modal */}
      {showShareCard && shareCardDream && (
        <DreamShareCard
          dream={shareCardDream.text}
          interpretation={shareCardDream.interpretation}
          mood={shareCardDream.mood}
          onClose={() => setShowShareCard(false)}
        />
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Drawer open button */}
        {!drawerOpen && (
          <button
            className="absolute top-6 left-6 z-20 bg-white/30 hover:bg-white/50 text-purple-900 rounded-full p-2 shadow-lg"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <span className="text-2xl">☰</span>
          </button>
        )}
        <div className="w-full max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold mb-2 text-white drop-shadow-lg" style={{letterSpacing: '0.01em'}}>🌙 <span className="font-extrabold" style={{color: 'white'}}>DreamDive</span></h1>
          </div>
          <form onSubmit={handleSubmit} 
            className="backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-2xl mx-auto p-8 flex flex-col gap-6 border border-white/30"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
              background: mood === 'Confusing'
                ? 'linear-gradient(120deg, rgba(140,100,255,0.45) 0%, rgba(255,255,255,0.7) 100%)'
                : 'linear-gradient(120deg, rgba(255,255,255,0.35) 60%, rgba(200,180,255,0.18) 100%)',
            }}
          >
            <label className="block text-lg font-semibold mb-1 text-white/80 text-left" htmlFor="dream-input">What did you dream about?</label>
            <textarea
              id="dream-input"
              className="w-full p-4 rounded-xl bg-white/80 border-none text-base text-gray-700 min-h-[5rem] shadow focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400 transition"
              value={dream}
              onChange={e => setDream(e.target.value)}
              required
              placeholder="What did you dream about?"
              style={{resize: 'none'}}
            />
            {/* Mood Selector - glassy, pastel, icon-based */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-base font-medium text-white/70 mb-1" htmlFor="mood-select">Mood</label>
              <button
                type="button"
                className="flex items-center justify-between w-full rounded-2xl p-4 bg-white/20 border border-white/30 shadow-xl focus:ring-2 focus:ring-blue-300 transition font-bold relative"
                style={{
                  background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0.10) 100%)',
                  boxShadow: '0 4px 24px 0 rgba(31,38,135,0.10)',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#fff',
                  fontWeight: 700,
                  outline: 'none',
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() => setMoodOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={moodOpen}
              >
                <span className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 border border-white/40 shadow-inner backdrop-blur-[6px] mr-2">
                    {currentMood.icon ? (
                      <currentMood.icon size={28} strokeWidth={2.2} className="text-white" />
                    ) : (
                      <Smile size={28} strokeWidth={2.2} className="text-white" />
                    )}
                  </span>
                  <span className="text-lg font-bold text-white drop-shadow-sm">{currentMood.label}</span>
                </span>
                <ChevronDown size={28} className={`ml-2 text-white transition-transform ${moodOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {moodOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 right-0 mt-2 z-20 rounded-3xl shadow-2xl border border-white/30 overflow-y-auto"
                    style={{
                      background: 'linear-gradient(120deg, rgba(180,160,255,0.38) 0%, rgba(160,200,255,0.32) 100%)',
                      backdropFilter: 'blur(28px)',
                      WebkitBackdropFilter: 'blur(28px)',
                      boxShadow: '0 8px 32px 0 rgba(120,120,255,0.18), 0 1.5px 8px 0 rgba(120,120,255,0.08) inset',
                      border: '2.5px solid rgba(255,255,255,0.22)',
                      padding: '8px 0',
                      minHeight: 220,
                      maxHeight: 260,
                      filter: 'drop-shadow(0 4px 32px rgba(140,100,255,0.10))',
                      overflowY: 'auto',
                    }}
                    role="listbox"
                  >
                    {moods.map(m => (
                      <li
                        key={m.label}
                        className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition text-lg font-bold rounded-2xl mx-2 my-1 ${m.label === mood ? 'bg-gradient-to-r from-purple-400/60 to-blue-400/40 shadow-lg border border-white/30 ring-2 ring-purple-300/40' : 'hover:bg-white/20 hover:ring-2 hover:ring-purple-200/30'} `}
                        style={{
                          color: '#fff',
                          boxShadow: m.label === mood ? '0 2px 16px 0 rgba(120,120,255,0.10)' : undefined,
                          border: m.label === mood ? '2px solid rgba(255,255,255,0.22)' : undefined,
                          filter: m.label === mood ? 'drop-shadow(0 2px 16px rgba(140,100,255,0.10))' : undefined,
                          transition: 'background 0.18s, box-shadow 0.18s, filter 0.18s',
                        }}
                        onClick={() => {
                          setMood(m.label);
                          setMoodOpen(false);
                          setEmojiAnimKey(k => k + 1);
                        }}
                        role="option"
                        aria-selected={m.label === mood}
                      >
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/30 shadow-inner backdrop-blur-[8px]">
                          {m.icon ? (
                            <m.icon size={28} strokeWidth={2.2} className="text-white" />
                          ) : (
                            <Smile size={28} strokeWidth={2.2} className="text-white" />
                          )}
                        </span>
                        <span className="text-white font-bold text-lg drop-shadow-sm tracking-wide">{m.label}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            {/* Add shifting-gradient-border styles if not present */}
            <style>{`
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
              type="submit"
              className="w-full py-3 text-lg font-semibold shifting-gradient-border mt-2"
              disabled={loading || !dream}
              style={{letterSpacing: '0.01em'}}
            >
              <span className="relative z-10">{loading ? "Interpreting..." : "Interpret Dream"}</span>
            </button>
            {error && <div className="text-red-500 text-lg font-semibold text-center mt-2">{error}</div>}
          </form>
          {interpretation && (
            <div ref={interpretationRef} className="mt-8 bg-purple-900/60 p-6 rounded-2xl shadow-xl w-full max-w-2xl mx-auto max-h-[40vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-2">Interpretation</h2>
              <div className="whitespace-pre-line text-lg">{interpretation}</div>
              {detailedInterpretation && (
                <div className="mt-6 p-4 rounded-xl bg-purple-800/80 text-white text-base whitespace-pre-line max-h-[30vh] overflow-y-auto">
                  <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                  {detailedInterpretation}
                </div>
              )}
              <div className="flex gap-4 mt-6 w-full justify-center">
                <button
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold shadow transition"
                  onClick={handleDetailedAnalysis}
                >
                  Detailed Analysis (Premium)
                </button>
                <button
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold shadow transition"
                  onClick={() => handleShareDream({ text: dream, interpretation, mood })}
                >
                  Share
                </button>
              </div>
            </div>
          )}
          {/* Premium Upgrade Modal */}
          {showPremiumPrompt && (
            <Modal
              isOpen={showPremiumPrompt}
              onClose={() => setShowPremiumPrompt(false)}
              title="Premium Feature"
              message="Detailed dream analysis is available for premium users only.<br/>Upgrade to unlock advanced insights and more!"
              onConfirm={() => { setShowPremiumPrompt(false); window.location.href = "/premium"; }}
              confirmText="Upgrade to Premium"
              confirmColor="yellow"
            />
          )}
          {/* Error Modal */}
          {error && (
            <Modal
              isOpen={!!error}
              onClose={() => setError("")}
              title="Error"
              message={error}
              onConfirm={() => setError("")}
              confirmText="Close"
              confirmColor="red"
            />
          )}
        </div>
        {/* Dream details modal */}
        {selectedDream && (
          <Modal
            isOpen={!!selectedDream}
            onClose={() => setSelectedDream(null)}
            title="Dream Details"
            actions={[
              {
                label: (<><X className="inline w-5 h-5 mr-1" /> Close</>),
                onClick: () => setSelectedDream(null),
                style: "flex-1 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-purple-900 font-bold shadow transition"
              },
              {
                label: (<><Share2 className="inline w-5 h-5 mr-1" /> Share</>),
                onClick: () => handleShareDream(selectedDream),
                style: "flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white font-bold shadow transition"
              },
              {
                label: (<><Trash2 className="inline w-5 h-5 mr-1" /> Delete</>),
                onClick: () => handleDeleteDream(selectedDream),
                style: "flex-1 py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold shadow transition"
              }
            ]}
          >
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <div className="text-lg text-purple-900 mb-2 font-semibold">{selectedDream.text}</div>
              <div className="text-base text-purple-700 mb-2">Mood: {selectedDream.mood}</div>
              <div className="text-base text-purple-800 whitespace-pre-line mb-2">{selectedDream.interpretation}</div>
              <div className="text-xs text-purple-400 mt-2">{selectedDream.createdAt?.toDate ? selectedDream.createdAt.toDate().toLocaleString() : ""}</div>
            </div>
          </Modal>
        )}
        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <Modal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            title="Delete Dream?"
            actions={[
              {
                label: "Cancel",
                onClick: () => setShowDeleteConfirm(false),
                style: "flex-1 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-purple-900 font-bold shadow transition"
              },
              {
                label: "Delete",
                onClick: confirmDeleteDream,
                style: "flex-1 py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold shadow transition"
              }
            ]}
          >
            <div className="text-base text-purple-800 text-center">Are you sure you want to delete this dream?</div>
          </Modal>
        )}
        {/* Community modal for premium users */}
        {showCommunity && user?.premium && (
          <PremiumCommunity onClose={() => setShowCommunity(false)} />
        )}
        <FloatingFeedbackButton />
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <Modal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          title="Log Out?"
          actions={[
            {
              label: "Cancel",
              onClick: () => setShowLogoutConfirm(false),
              style: "flex-1 py-2 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-purple-900 font-bold shadow transition"
            },
            {
              label: "Log Out",
              onClick: () => { setShowLogoutConfirm(false); setDrawerOpen(false); logout(); },
              style: "flex-1 py-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold shadow transition"
            }
          ]}
        >
          <div className="text-base text-purple-800 text-center">Are you sure you want to log out of DreamDive?</div>
        </Modal>
      )}
      {/* Save-to-journal animation */}
      <AnimatePresence>
        {showSaveAnim && (
          <motion.div
            initial={{ x: animStart.x, y: animStart.y, scale: 1, opacity: 1 }}
            animate={{ x: animEnd.x, y: animEnd.y, scale: 0.5, opacity: 0.7 }}
            exit={{ opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed z-[9999] pointer-events-none"
            style={{ left: 0, top: 0 }}
            onAnimationComplete={() => setTimeout(() => setShowSaveAnim(false), 200)}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-purple-400 to-blue-400 shadow-2xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 