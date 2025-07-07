// src/SideDrawer.jsx
import React from "react";
import { motion } from "framer-motion";
import { LogOut, Crown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumBadge from "./PremiumBadge.jsx";

const SideDrawer = ({ onClose, onLogout, user, dreams = [], onDreamClick, isPremium, onCommunity }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 180, damping: 22, mass: 0.7 }}
      className="fixed top-0 left-0 h-full w-80 z-50 p-0 flex flex-col rounded-r-3xl border-r border-white/30 shadow-2xl"
      style={{
        minWidth: 320,
        background: 'linear-gradient(120deg, rgba(255,255,255,0.32) 60%, rgba(180,160,255,0.18) 100%)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRight: '2.5px solid rgba(255,255,255,0.22)',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18), 0 1.5px 8px 0 rgba(120,120,255,0.08) inset',
      }}
    >
      <div className="flex-1 flex flex-col overflow-y-auto p-6 pb-4">
        {/* DreamDive logo and name */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl select-none">🌙</span>
          <span className="text-2xl font-bold text-white drop-shadow">DreamDive</span>
        </div>
        {/* User profile */}
        <div className="flex items-center gap-3 mb-6">
          {user?.photo
            ? <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" />
            : <span className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/60 shadow-inner" style={{backdropFilter:'blur(6px)'}}>{user?.name?.[0]?.toUpperCase() || 'N'}</span>
          }
          <span className="text-lg font-semibold text-white flex items-center gap-2">Hi, {user?.name || 'User'}
            {isPremium && (
              <span className="ml-2 flex items-center">
                <PremiumBadge size="small" />
              </span>
            )}
          </span>
        </div>
        {/* Community button for premium users */}
        {isPremium && (
          <button
            onClick={onCommunity}
            className="w-full mb-6 py-3 rounded-2xl bg-gradient-to-r from-pink-400/80 via-purple-400/80 to-blue-400/80 hover:from-pink-500/90 hover:to-blue-500/90 text-white font-bold text-lg shadow-xl flex items-center justify-center gap-2 border border-white/30 outline-none transition backdrop-blur-[6px]"
            style={{boxShadow:'0 2px 16px 0 rgba(120,120,255,0.10)', backdropFilter:'blur(8px)'}}
          >
            <span className="text-xl">👥</span> The Community
          </button>
        )}
        {/* Dream Journal */}
        <div className="mb-6">
          <div className="text-xl font-bold text-pink-300 mb-1">Dream Journal</div>
          <div className="text-sm text-white/70 mb-3">See your latest dreams in the Journal!</div>
          <div className="space-y-4">
            {(dreams.length > 0 ? dreams : [
              {text: "I was superman", mood: "Confusing", interpretation: ""},
              {text: "I was superman", mood: "Peaceful", interpretation: ""},
            ]).map((dream, i) => (
              <div
                key={dream.id || i}
                className="rounded-2xl border border-white/30 px-4 py-3 flex flex-col shadow-lg cursor-pointer transition backdrop-blur-[4px] hover:brightness-110"
                style={{
                  background: 'linear-gradient(120deg, rgba(20,20,30,0.18) 0%, rgba(40,30,60,0.13) 60%, rgba(160,120,255,0.06) 100%)',
                  boxShadow: '0 2px 12px 0 rgba(120,120,255,0.08)',
                  backdropFilter: 'blur(8px)',
                }}
                onClick={() => onDreamClick && onDreamClick(dream)}
              >
                <span className="font-bold text-lg text-white mb-1 drop-shadow-sm">{dream.text}</span>
                <span className="text-pink-200 text-base font-medium drop-shadow">{dream.mood}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Go Premium and Logout */}
      <div className="flex flex-col gap-4 p-6 pt-0 sticky bottom-0 z-10 transition-all duration-500 ease-out"
        style={{
          background: 'linear-gradient(120deg, rgba(20,20,30,0.38) 0%, rgba(40,30,60,0.32) 60%, rgba(160,120,255,0.09) 100%), linear-gradient(120deg, rgba(255,255,255,0.13) 0%, rgba(180,160,255,0.10) 60%, rgba(160,120,255,0.09) 100%)',
          backdropFilter: 'blur(24px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
          borderTop: 'none',
          boxShadow: '0 -8px 32px 0 rgba(120,120,255,0.10) inset',
        }}>
        <button
          onClick={() => {
            onClose();
            navigate("/premium");
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-200 via-pink-400 via-fuchsia-400 to-purple-400 text-white font-bold text-lg shadow-xl flex items-center justify-center gap-2 outline-none backdrop-blur-[6px] transition-all duration-300 ease-out hover:brightness-110 hover:shadow-2xl hover:scale-[1.025]"
          style={{boxShadow:'0 2px 16px 0 rgba(200,120,255,0.10)', border: 'none', backdropFilter:'blur(8px)'}}
        >
          <Crown className="w-5 h-5 text-white drop-shadow" />
          Go Premium
        </button>
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-300 via-pink-400 via-fuchsia-500 to-red-500 text-white font-bold text-lg shadow-xl flex items-center justify-center gap-2 outline-none backdrop-blur-[6px] transition-all duration-300 ease-out hover:brightness-110 hover:shadow-2xl hover:scale-[1.025]"
          style={{boxShadow:'0 2px 16px 0 rgba(255,0,80,0.10)', border: 'none', backdropFilter:'blur(8px)'}}
        >
          <LogOut className="w-5 h-5 text-white drop-shadow" />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default SideDrawer;
