import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import FloatingIcons from "./FloatingIcons.jsx";
import MoodBackgrounds from "./MoodBackgrounds.jsx";
import MoodDropdown from "./MoodDropdown.jsx";
import confetti from "canvas-confetti";
import { db, addDoc, collection, getDocs, deleteDoc, doc } from "./firebase";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useState as useReactState } from "react";
import { Crown, LogOut, Share2, Users, Sparkles, Zap, Menu } from "lucide-react";
import DreamJournal from "./DreamJournal";
import FloatingFeedbackButton from "./FloatingFeedbackButton.jsx";
import DreamShareCard from "./DreamShareCard.jsx";
import PremiumCommunity from "./PremiumCommunity.jsx";
import { PremiumBadgeWithTooltip, PremiumStatusIndicator } from "./PremiumBadge.jsx";
import SideDrawer from "./SideDrawer";

export default function InsertDream() {
  const { user, logout } = useAuth();

  const demoDreams = [
    "I was flying over a city of clouds...",
    "A cat whispered secrets to me in a forest...",
    "I kept falling but never hit the ground...",
    "I saw my younger self in a mirror...",
    "There was a glowing key inside a dream library...",
  ];
  const [demoIndex, setDemoIndex] = useState(0);

  const [dream, setDream] = useState("");
  const [mood, setMood] = useState({ label: "Peaceful", icon: "🧘" });
  const [response, setResponse] = useState("");
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultTimestamp, setResultTimestamp] = useState(null);
  const [showMetaForDownload, setShowMetaForDownload] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useReactState(false);
  const [dreamCount, setDreamCount] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null);
  const [showInterpretationModal, setShowInterpretationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dreamToDelete, setDreamToDelete] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareDream, setShareDream] = useState(null);
  const [detailedLoading, setDetailedLoading] = useState(false);
  
  // New premium feature states
  const [showShareCard, setShowShareCard] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [currentDreamForSharing, setCurrentDreamForSharing] = useState(null);

  const shareRef = useRef(null);

  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dreams, setDreams] = useState([]);

  // Cycle demo dreams
  useEffect(() => {
    const iv = setInterval(() => setDemoIndex(i => (i + 1) % demoDreams.length), 3000);
    return () => clearInterval(iv);
  }, []);

  // Fetch dream count for non-premium users (today only)
  useEffect(() => {
    const fetchDreamCount = async () => {
      if (user.uid && !user.premium) {
        const dreamsRef = collection(db, "users", user.uid, "dreams");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const snapshot = await getDocs(dreamsRef);
        const todayDreams = snapshot.docs.filter(doc => {
          const data = doc.data();
          if (!data.createdAt) return false;
          const createdAt = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          return createdAt >= today;
        });
        setDreamCount(todayDreams.length);
      }
    };
    fetchDreamCount();
  }, [user.uid, user.premium, response]);

  // Fetch dreams for mobile sidebar
  useEffect(() => {
    async function fetchDreams() {
      if (!user?.uid) return;
      const dreamsRef = collection(db, "users", user.uid, "dreams");
      const snapshot = await getDocs(dreamsRef);
      const dreamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDreams(dreamsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }
    fetchDreams();
  }, [user]);

  // Determine mood-based gradient
  const backgroundClass = useMemo(() => {
    switch ((mood.label || "").toLowerCase()) {
      case "peaceful": return "from-blue-800 to-blue-900";
      case "scary": return "from-red-800 to-gray-900";
      case "romantic": return "from-pink-700 to-purple-900";
      case "funny": return "from-yellow-400 to-orange-500";
      case "weird": return "from-lime-600 to-indigo-900";
      case "confusing": return "from-cyan-600 to-fuchsia-800";
      case "spiritual": return "from-emerald-400 via-indigo-700 to-purple-900";
      default: return "from-indigo-900 to-gray-900";
    }
  }, [mood.label]);

  // Typewriter effect
  const typeText = (text) => {
    setTypedText("");
    let i = 0;
    const iv = setInterval(() => {
      setTypedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, 30);
  };

  // Interpret dream (limit for non-premium)
  const handleSubmit = async (isDetailed = false) => {
    console.log('handleSubmit called');
    if (!dream.trim()) {
      console.log('Dream is empty');
      return;
    }
    
    if (!user.premium && dreamCount >= 4) {
      setShowDailyLimitModal(true);
      return;
    }
    
    if (isDetailed && !user.premium) {
      setShowPremiumModal(true);
      return;
    }
    
    if (isDetailed) {
      setDetailedLoading(true);
    } else {
      setLoading(true);
    }
    setResponse("");
    setTypedText("");

    const base = process.env.NODE_ENV === "production"
      ? "/.netlify/functions/interpret"
      : "http://localhost:3000/interpret";

    try {
      console.log('Sending fetch...');
      const res = await fetch(base, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream, mood: mood.label, isDetailed }),
      });
      console.log('Fetch sent, awaiting response...');
      const data = await res.json();
      console.log('Received data:', data);
      const interp = data.interpretation || "No response.";
      setResponse(interp);
      typeText(interp);
      setResultTimestamp(new Date());

      if (user.uid) {
        const dreamsRef = collection(db, "users", user.uid, "dreams");
        try {
          await addDoc(dreamsRef, {
            text: dream,
            mood: mood.label,
            interpretation: interp,
            createdAt: new Date(),
            isDetailed: isDetailed,
          });
        } catch (firestoreErr) {
          console.error('Error saving dream to Firestore:', firestoreErr);
          alert('Failed to save dream to journal.');
        }
      } else {
        alert('User ID not found. Please log in again.');
      }
    } catch (e) {
      console.error('Error in handleSubmit:', e);
      const errMsg = "Oops—couldn't interpret your dream.";
      setResponse(errMsg);
      typeText(errMsg);
      setResultTimestamp(new Date());
    } finally {
      if (isDetailed) {
        setDetailedLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Download combined content
  const downloadImage = async () => {
    if (!shareRef.current) return;
    setShowMetaForDownload(true);
    await new Promise(r => setTimeout(r, 100));
    const canvas = await html2canvas(shareRef.current);
    const link = document.createElement("a");
    const ts = resultTimestamp ? resultTimestamp.toISOString().replace(/[:.]/g, "-") : Date.now();
    link.download = `dream_${ts}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setShowMetaForDownload(false);
  };

  // Handler to delete a dream
  const handleDeleteDream = (dream) => {
    setDreamToDelete(dream);
    setShowDeleteModal(true);
  };

  const confirmDeleteDream = async () => {
    if (!user?.uid || !dreamToDelete?.id) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "dreams", dreamToDelete.id));
    } catch (err) {
      alert("Failed to delete dream: " + err.message);
    } finally {
      setShowDeleteModal(false);
      setDreamToDelete(null);
    }
  };

  // Handler to share a dream
  const handleShareDream = (dream) => {
    const shareUrl = `${window.location.origin}/share/dream/${dream.id}`;
    setShareLink(shareUrl);
    setShareDream(dream);
    setShowShareModal(true);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      // Optionally show a copied state
    } catch {}
  };

  // New premium feature handlers
  const handleShareCard = () => {
    if (!user.premium) {
      setShowPremiumModal(true);
      return;
    }
    
    setCurrentDreamForSharing({
      dream: dream,
      interpretation: response,
      mood: mood.label
    });
    setShowShareCard(true);
  };

  const handleOpenCommunity = () => {
    if (!user.premium) {
      setShowPremiumModal(true);
      return;
    }
    setShowCommunity(true);
  };

  // Handler for mobile sidebar dream click
  const handleMobileDreamClick = (dream) => {
    setSelectedDream(dream);
    setShowInterpretationModal(true);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-white/20 rounded-full p-2 border border-white/30 shadow-lg backdrop-blur-xl"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open sidebar menu"
      >
        <Menu className="w-7 h-7 text-white" />
      </button>
      {/* Mobile sidebar drawer and overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <SideDrawer
            onClose={() => setIsSidebarOpen(false)}
            onLogout={logout}
            user={user}
            dreams={dreams}
            onDreamClick={handleMobileDreamClick}
          />
        </>
      )}
      {/* Poetic line for main app screen */}
      {/* Removed poetic line, now handled by LegalFooter */}
      <div className={`flex h-screen relative overflow-hidden bg-gradient-to-br ${backgroundClass}`} style={{paddingBottom: '64px'}}>
        {/* Animated BG */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <MoodBackgrounds mood={mood.label} />
          <FloatingIcons />
        </div>
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col h-screen justify-between w-64 bg-white/20 backdrop-blur-xl bg-opacity-20 border border-white/20 text-white p-6 z-20 shadow-2xl">
          {/* Logo at top */}
          <div className="flex flex-col flex-grow min-h-0">
            <div className="flex items-center justify-center mb-6 gap-2">
              <span role="img" aria-label="logo" className="text-3xl">🌙</span>
              <span className="text-2xl font-bold text-white">DreamDive</span>
            </div>
            {/* User greeting with premium badge */}
            <div className="flex items-center gap-3 mb-6 flex-shrink-0">
              {user.photo
                ? <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-lg" />
                : <span className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white text-2xl">🌙</span>
              }
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-white">Hi, {user.name}</p>
                  <PremiumBadgeWithTooltip user={user} />
                </div>
                {user.premium && (
                  <PremiumStatusIndicator user={user} className="text-xs text-yellow-300" />
                )}
              </div>
            </div>
            {/* Journal header */}
            <h2 className="text-xl font-bold text-purple-300 mb-2 flex-shrink-0">Dream Journal</h2>
            <p className="text-xs text-white/60 mb-4 flex-shrink-0">See your latest dreams in the Journal!</p>
            {/* Dream Journal entries */}
            <div className="flex-grow overflow-y-auto -mr-3 pr-3">
              <DreamJournal
                user={user}
                onSelectDream={dream => { setSelectedDream(dream); setShowInterpretationModal(true); }}
                onDeleteDream={handleDeleteDream}
                onShareDream={handleShareDream}
              />
            </div>
          </div>
          {/* Buttons at the bottom */}
          <div className="flex flex-col gap-2 mt-auto pt-4 flex-shrink-0">
            {/* Premium Community Button */}
            {user.premium && (
              <button
                onClick={handleOpenCommunity}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg shadow-xl transition-transform duration-200 transform hover:scale-105 flex items-center justify-center gap-2 border-none outline-none"
              >
                <Users className="w-5 h-5 text-white drop-shadow" />
                Community
              </button>
            )}
            
            {user.premium ? (
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 hover:from-green-500 hover:to-purple-600 text-white font-bold text-lg shadow-xl transition-transform duration-200 transform hover:scale-105 flex items-center justify-center gap-2 border-none outline-none"
                onClick={() => window.location.href='/premium'}
              >
                <span className="material-icons w-5 h-5 text-white drop-shadow">credit_card</span>
                Manage Subscription
              </button>
            ) : (
              <button
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white font-bold text-lg shadow-xl transition-transform duration-200 transform hover:scale-105 flex items-center justify-center gap-2 border-none outline-none"
                onClick={() => window.location.href='/premium'}
              >
                <Crown className="w-5 h-5 text-white drop-shadow" />
                Go Premium
              </button>
            )}
            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 via-pink-500 to-red-700 hover:from-red-600 hover:to-pink-700 text-white font-bold text-lg shadow-xl transition-transform duration-200 transform hover:scale-105 flex items-center justify-center gap-2 border-none outline-none"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="w-5 h-5 text-white drop-shadow" />
              Logout
            </button>
          </div>
        </aside>
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 ml-0 md:ml-64 w-full mb-24">
          <div className="relative z-10 w-full max-w-xl mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-white mb-6 flex items-center gap-2">
              <span role='img' aria-label='moon'>🌙</span> DreamDive
            </h1>
            {/* Dream input */}
            <textarea
              rows={4}
              value={dream}
              onChange={e => setDream(e.target.value)}
              placeholder="What did you dream about?"
              className="w-full p-3 rounded-xl mb-4 text-black resize-none"
            />
            <label className="self-start text-sm mb-1 text-white">Mood</label>
            <MoodDropdown mood={mood} setMood={setMood} />
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading || !dream.trim()}
              className={`w-full mt-4 py-2 rounded-xl text-white transition ${loading ? "bg-indigo-300" : "bg-indigo-500 hover:bg-indigo-600"}`}
            >
              {loading ? "Interpreting..." : "Interpret Dream"}
            </button>

            {/* Interpretation & actions */}
            {(typedText || response) && (
              <motion.div
                ref={shareRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 w-full p-4 bg-white/20 rounded-xl flex flex-col items-center"
              >
                {/* Metadata only on download */}
                {showMetaForDownload && resultTimestamp && (
                  <div className="w-full mb-2 text-xs text-black text-left space-y-1 p-2 bg-white rounded-lg">
                    <p><strong>Dream:</strong> {dream}</p>
                    <p><strong>Mood:</strong> {mood.icon} {mood.label}</p>
                    <p><strong>Date:</strong> {resultTimestamp.toLocaleString()}</p>
                  </div>
                )}
                {/* Interpretation text */}
                <p className="text-sm text-indigo-100 mb-1">Interpretation:</p>
                <div className="w-full bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-base whitespace-pre-wrap text-white leading-relaxed">{typedText || response}</p>
                </div>
                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mt-4 w-full justify-center">
                  {/* Premium Features */}
                  {user.premium && (
                    <>
                      <button
                        onClick={() => handleSubmit(true)}
                        disabled={detailedLoading || !dream.trim()}
                        className={`py-2 px-4 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${detailedLoading ? "bg-purple-300 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
                      >
                        <Sparkles className="w-4 h-4" />
                        {detailedLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg> 
                            Analyzing...
                          </span>
                        ) : (
                          "Advanced Analysis"
                        )}
                      </button>
                      <button
                        onClick={handleShareCard}
                        className="py-2 px-4 rounded-xl text-sm font-semibold transition bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Card
                      </button>
                    </>
                  )}
                  
                  {/* Free user features */}
                  {!user.premium && (
                    <>
                      <button
                        onClick={() => handleSubmit(true)}
                        className="py-2 px-4 rounded-xl text-sm font-semibold transition bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Advanced Analysis
                      </button>
                      <button
                        onClick={handleShareCard}
                        className="py-2 px-4 rounded-xl text-sm font-semibold transition bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Card
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Feature Modals */}
      {showShareCard && currentDreamForSharing && (
        <DreamShareCard
          dream={currentDreamForSharing.dream}
          interpretation={currentDreamForSharing.interpretation}
          mood={currentDreamForSharing.mood}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {showCommunity && (
        <PremiumCommunity onClose={() => setShowCommunity(false)} />
      )}

      {/* Premium Upgrade Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-white/30">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2>
              <p className="text-white/80 mb-6">This feature is exclusive to Premium members. Upgrade to unlock advanced dream analysis, sharing cards, and community access.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 py-3 px-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowPremiumModal(false);
                    navigate('/premium');
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-xl transition"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center relative">
            <span className="text-4xl mb-3">🔒</span>
            <h2 className="text-xl font-bold text-white mb-2 text-center">Log out of DreamDive?</h2>
            <p className="text-white/70 text-center mb-6">Are you sure you want to log out?</p>
            <div className="flex w-full">
              <button
                className="flex-1 w-full py-2 rounded-l-xl bg-white/30 hover:bg-white/50 text-purple-700 font-bold transition shadow"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 w-full py-2 rounded-r-xl bg-red-500 hover:bg-red-600 text-white font-bold transition shadow"
                onClick={async () => {
                  setShowLogoutModal(false);
                  await logout();
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Daily Limit Modal */}
      {showDailyLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center relative">
            <span className="text-4xl mb-3">⏳</span>
            <h2 className="text-xl font-bold text-white mb-2 text-center">Daily Limit Reached</h2>
            <p className="text-white/70 text-center mb-6">Your daily limit is over. Upgrade to Pro for unlimited dream interpretations!</p>
            <div className="flex gap-3 w-full">
              <button
                className="flex-1 py-2 rounded-xl bg-white/30 hover:bg-white/50 text-purple-700 font-bold transition shadow"
                onClick={() => setShowDailyLimitModal(false)}
              >
                Close
              </button>
              <button
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold transition shadow"
                onClick={() => {
                  setShowDailyLimitModal(false);
                  navigate('/premium');
                }}
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Dream Interpretation Modal */}
      {showInterpretationModal && selectedDream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl p-8 max-w-lg w-full flex flex-col items-center relative">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">{selectedDream.text}</h2>
            <div className="text-purple-200 mb-4">Mood: {selectedDream.mood}</div>
            <div className="bg-purple-600/30 rounded-xl p-4 text-white/90 text-center mb-6">
              <span className="font-bold">Interpretation:</span> {selectedDream.interpretation}
            </div>
            <button
              className="w-full py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition shadow"
              onClick={() => setShowInterpretationModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Delete Dream Modal */}
      {showDeleteModal && dreamToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center relative">
            <span className="text-4xl mb-3">🗑️</span>
            <h2 className="text-xl font-bold text-white mb-2 text-center">Delete Dream?</h2>
            <p className="text-white/70 text-center mb-6">Are you sure you want to delete this dream?</p>
            <div className="flex w-full gap-2">
              <button
                className="flex-1 w-full py-2 rounded-xl bg-white/30 hover:bg-white/50 text-purple-700 font-bold transition shadow"
                onClick={() => { setShowDeleteModal(false); setDreamToDelete(null); }}
              >
                Cancel
              </button>
              <button
                className="flex-1 w-full py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition shadow"
                onClick={confirmDeleteDream}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Share Dream Modal */}
      {showShareModal && shareDream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center relative">
            <span className="text-4xl mb-3">🔗</span>
            <h2 className="text-xl font-bold text-white mb-2 text-center">Share your dream</h2>
            <div className="w-full mb-4">
              <div className="text-white/80 text-sm mb-1">Dream:</div>
              <div className="bg-white/30 rounded-lg px-3 py-2 text-white text-base truncate" title={shareDream.text}>{shareDream.text}</div>
            </div>
            <div className="w-full mb-4">
              <div className="text-white/80 text-sm mb-1">Shareable Link:</div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg bg-white/30 text-white text-sm border-none outline-none"
                  onFocus={e => e.target.select()}
                />
                <button
                  className="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition shadow"
                  onClick={handleCopyShareLink}
                >
                  Copy
                </button>
              </div>
            </div>
            <button
              className="w-full py-2 rounded-xl bg-white/30 hover:bg-white/50 text-purple-700 font-bold transition shadow mt-2"
              onClick={() => { setShowShareModal(false); setShareDream(null); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <FloatingFeedbackButton />
    </>
  );
}
