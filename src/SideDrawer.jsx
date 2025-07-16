// src/SideDrawer.jsx
import React from "react";
import { motion } from "framer-motion";
import { LogOut, Crown, X, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumBadge from "./PremiumBadge.jsx";

const moodEmojis = {
  Peaceful: "🧘",
  Scary: "😱",
  Romantic: "💘",
  Confusing: "🤯",
  Funny: "😂",
  Weird: "👻",
  Spiritual: "🕊️"
};

const SideDrawer = ({ onClose, onLogout, user, dreams = [], onDreamClick, isPremium, onCommunity }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.7 }}
      className="fixed top-0 left-0 h-full w-80 z-50 p-0 flex flex-col rounded-r-3xl border-r border-white/30 shadow-2xl overflow-hidden"
      style={{
        minWidth: 320,
        background: 'linear-gradient(135deg, rgba(60,40,120,0.55) 0%, rgba(120,160,255,0.18) 100%)',
        backdropFilter: 'blur(40px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
        borderRight: '2.5px solid rgba(255,255,255,0.22)',
        boxShadow: '0 12px 48px 0 rgba(31,38,135,0.22), 0 2px 16px 0 rgba(120,120,255,0.10) inset',
      }}
    >
      {/* Aurora/Stars Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-pink-400/30 via-purple-400/30 to-blue-400/20 rounded-full blur-3xl animate-aurora1" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-tr from-yellow-200/30 via-pink-200/20 to-purple-300/20 rounded-full blur-2xl animate-aurora2" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/60 rounded-full shadow-2xl animate-twinkle" style={{animationDelay:'0.7s'}} />
        <div className="absolute top-1/3 left-2/3 w-1.5 h-1.5 bg-white/40 rounded-full shadow-2xl animate-twinkle" style={{animationDelay:'1.2s'}} />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto p-8 pb-4 gap-8 z-10 custom-scrollbar">
        {/* DreamDive logo and name */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="text-5xl select-none drop-shadow-lg animate-pulse-slow">🌙</span>
          <span className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide animate-gradient-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">DreamDive</span>
        </div>
        {/* User profile */}
        <div className="flex flex-col items-center gap-3 mb-8 relative">
          <div className="relative flex flex-col items-center">
            {user?.photo
              ? <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-full border-4 border-white/80 shadow-2xl animate-profile-glow" />
              : <span className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-300 via-blue-200 to-pink-200 flex items-center justify-center text-white text-4xl font-extrabold border-4 border-white/80 shadow-2xl animate-profile-glow">
                  {user?.name?.[0]?.toUpperCase() || 'N'}
                </span>
            }
            {isPremium && (
              <span className="absolute -bottom-3 right-2 animate-bounce-slow">
                <PremiumBadge size="small" />
              </span>
            )}
          </div>
          <span className="text-lg font-semibold text-white flex flex-col gap-1 items-center">
            <span className="opacity-80">Hi,</span>
            <span className="text-2xl font-bold tracking-wide text-white drop-shadow animate-gradient-text bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-300 bg-clip-text text-transparent">{user?.name || 'User'}</span>
            {isPremium && <span className="mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 text-purple-900 text-xs font-bold shadow animate-pulse-slow">Premium</span>}
          </span>
        </div>
        {/* Community button for premium users */}
        {isPremium && (
          <motion.button
            onClick={onCommunity}
            className="w-full mb-8 py-3 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-extrabold text-lg shadow-2xl flex items-center justify-center gap-3 border-2 border-transparent outline-none transition-all duration-200 backdrop-blur-[8px] relative overflow-hidden group hover:scale-105 hover:border-purple-300 focus:ring-2 focus:ring-purple-400 animate-community-float"
            style={{boxShadow:'0 4px 32px 0 rgba(120,120,255,0.18)', backdropFilter:'blur(12px)'}}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-60 blur-lg group-hover:opacity-80 transition-all duration-300 animate-gradient-x" style={{zIndex:0}} />
            <Users className="w-7 h-7 text-white drop-shadow-lg relative z-10 animate-wiggle" />
            <span className="relative z-10 tracking-wide">The Community</span>
          </motion.button>
        )}
        {/* Dream Journal */}
        <div className="mb-8">
          <div className="text-2xl font-extrabold text-pink-300 mb-2 tracking-wide drop-shadow flex items-center gap-2"><Sparkles className="w-6 h-6 text-pink-300 animate-flicker" />Dream Journal</div>
          <div className="text-base text-white/70 mb-4">See your latest dreams in the Journal!</div>
          <div className="space-y-5">
            {(dreams.length > 0 ? dreams : [
              {text: "I was superman", mood: "Confusing", interpretation: ""},
              {text: "I was superman", mood: "Peaceful", interpretation: ""},
            ]).map((dream, i) => (
              <motion.div
                key={dream.id || i}
                className="rounded-3xl border border-white/30 px-5 py-4 flex flex-col shadow-2xl cursor-pointer transition backdrop-blur-[6px] hover:scale-105 hover:shadow-3xl hover:border-pink-200/60 group bg-gradient-to-br from-white/10 via-purple-100/10 to-pink-100/10"
                style={{
                  boxShadow: '0 4px 24px 0 rgba(120,120,255,0.13)',
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{ y: -2, scale: 1.04 }}
                onClick={() => onDreamClick && onDreamClick(dream)}
              >
                <span className="font-bold text-lg text-white mb-1 drop-shadow-sm group-hover:text-pink-200 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center text-pink-400 text-base font-bold shadow-inner mr-1 animate-flicker">{moodEmojis[dream.mood] || "🌙"}</span>
                  {dream.text}
                </span>
                <span className="text-pink-200 text-base font-semibold drop-shadow group-hover:text-pink-400 transition-colors duration-200">{dream.mood}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Go Premium / Manage Subscription and Logout */}
      <div className="flex flex-col gap-5 p-8 pt-0 sticky bottom-0 z-10 transition-all duration-500 ease-out bg-gradient-to-t from-black/40 via-purple-900/20 to-transparent backdrop-blur-2xl border-t border-white/20 shadow-2xl">
        {isPremium ? (
          <motion.button
            onClick={() => {
              onClose();
              navigate("/premium");
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-2 outline-none backdrop-blur-[8px] transition-all duration-300 ease-out hover:brightness-110 hover:shadow-3xl hover:scale-[1.045] animate-neon-glow border-none"
            style={{boxShadow:'0 4px 24px 0 rgba(200,120,255,0.13)', border: 'none', backdropFilter:'blur(10px)'}}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
          >
            <Crown className="w-6 h-6 text-white drop-shadow" />
            Manage your subscription
          </motion.button>
        ) : (
          <motion.button
            onClick={() => {
              onClose();
              navigate("/premium");
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-200 via-pink-400 via-fuchsia-400 to-purple-400 text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-2 outline-none backdrop-blur-[8px] transition-all duration-300 ease-out hover:brightness-110 hover:shadow-3xl hover:scale-[1.045] animate-neon-glow border-none"
            style={{boxShadow:'0 4px 24px 0 rgba(200,120,255,0.13)', border: 'none', backdropFilter:'blur(10px)'}}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
          >
            <Crown className="w-6 h-6 text-white drop-shadow" />
            Go Premium
          </motion.button>
        )}
        <motion.button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-300 via-pink-400 via-fuchsia-500 to-red-500 text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-2 outline-none backdrop-blur-[8px] transition-all duration-300 ease-out hover:brightness-110 hover:shadow-3xl hover:scale-[1.045] animate-neon-glow border-none"
          style={{boxShadow:'0 4px 24px 0 rgba(255,0,80,0.13)', border: 'none', backdropFilter:'blur(10px)'}}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
        >
          <LogOut className="w-6 h-6 text-white drop-shadow" />
          Logout
        </motion.button>
      </div>
      {/* Animations & Custom Scrollbar */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s linear infinite;
        }
        @keyframes profile-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.5), 0 0 24px 8px #a78bfa; }
          50% { box-shadow: 0 0 0 8px rgba(168,139,250,0.18), 0 0 32px 12px #a78bfa; }
        }
        .animate-profile-glow {
          animation: profile-glow 3.5s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.2s infinite;
        }
        @keyframes community-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px) scale(1.04); }
        }
        .animate-community-float {
          animation: community-float 3.2s ease-in-out infinite;
        }
        @keyframes neon-glow {
          0%, 100% { filter: drop-shadow(0 0 8px #fff) drop-shadow(0 0 16px #a78bfa); }
          50% { filter: drop-shadow(0 0 16px #f472b6) drop-shadow(0 0 32px #a78bfa); }
        }
        .animate-neon-glow {
          animation: neon-glow 2.8s ease-in-out infinite;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-wiggle {
          animation: wiggle 2.5s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3.5s ease-in-out infinite;
        }
        @keyframes aurora1 {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.7; }
          50% { transform: scale(1.1) translateY(20px); opacity: 1; }
        }
        .animate-aurora1 {
          animation: aurora1 8s ease-in-out infinite;
        }
        @keyframes aurora2 {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.5; }
          50% { transform: scale(1.08) translateY(-16px); opacity: 0.8; }
        }
        .animate-aurora2 {
          animation: aurora2 10s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 2.5s ease-in-out infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-flicker {
          animation: flicker 2.2s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-x 6s linear infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default SideDrawer;
