import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, Star, Zap, Award } from "lucide-react";

const PremiumBadge = ({ size = "medium" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizeClasses = {
    small: "w-7 h-7",
    medium: "w-10 h-10",
    large: "w-14 h-14",
    xlarge: "w-20 h-20"
  };

  const badgeVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.15,
      rotate: 0,
      transition: { duration: 0.3, type: "spring", stiffness: 300 }
    }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: 0.5
      }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: {
      opacity: 0.8,
      scale: 1.2,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(v => !v)}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Main Badge */}
      <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-yellow-300 via-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white/80 overflow-hidden`}
        style={{ boxShadow: '0 0 24px 4px #fbbf24, 0 2px 8px 0 #f472b6' }}
      >
        {/* Animated Shine */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ x: ["-100%", "120%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.18) 100%)",
            filter: "blur(2px)",
            opacity: 0.7
          }}
        />
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.18) 60%, transparent 100%)",
            zIndex: 1
          }}
        />
        {/* Crown Icon */}
        <motion.div
          className="relative z-10"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <Crown className="w-2/3 h-2/3 text-white drop-shadow-lg" />
        </motion.div>
      </div>
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gradient-to-br from-white/30 to-purple-200/40 text-purple-900 text-sm rounded-xl shadow-2xl border border-white/30 backdrop-blur-xl font-bold pointer-events-none max-w-xs z-[100] drop-shadow-xl text-center break-words"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', minWidth: '120px' }}
          >
            Premium User
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Premium Status Indicator Component
export const PremiumStatusIndicator = ({ user, className = "" }) => {
  if (!user?.premium) return null;

  return null;
};

// Premium Badge with Tooltip
export const PremiumBadgeWithTooltip = ({ user, className = "" }) => {
  if (!user?.premium) return null;

  // Publish event on hover
  const handleHover = () => {
    // You can replace this with a custom event if needed
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('premium-badge-hover', { detail: { user } }));
    }
    // For debugging/demo, also log
    console.log('Premium badge hovered', user);
  };

  return (
    <motion.div 
      className={`group relative inline-block ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      onMouseEnter={handleHover}
    >
      <PremiumBadge size="medium" />
      {/* Enhanced Tooltip */}
      <AnimatePresence>
        <motion.div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">Premium User</span>
          </div>
          <div className="text-xs text-gray-300 mt-1">
            {user.premiumPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Premium Badge for Profile
export const ProfilePremiumBadge = ({ user, className = "" }) => {
  if (!user?.premium) return null;

  return (
    <motion.div 
      className={`flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50/90 to-orange-50/90 rounded-2xl border border-yellow-200/50 shadow-lg backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      <PremiumBadge size="large" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-gray-900">Premium Member</span>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-sm text-gray-600">
          {user.premiumPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'} • 
          {user.premiumEndDate ? ` Expires ${new Date(user.premiumEndDate).toLocaleDateString()}` : ' Active'}
        </p>
      </div>
    </motion.div>
  );
};

// Floating Premium Badge
export const FloatingPremiumBadge = ({ user, className = "" }) => {
  if (!user?.premium) return null;

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-40 ${className}`}
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1, y: -5 }}
    >
      <div className="relative">
        <PremiumBadge size="large" />
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          PRO
        </motion.div>
      </div>
    </motion.div>
  );
};

// Premium Badge with Pulse Effect
export const PulsingPremiumBadge = ({ user, className = "" }) => {
  if (!user?.premium) return null;

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ 
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 0 rgba(251, 191, 36, 0.4)",
          "0 0 0 10px rgba(251, 191, 36, 0)",
          "0 0 0 0 rgba(251, 191, 36, 0)"
        ]
      }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <PremiumBadge size="medium" />
    </motion.div>
  );
};

export default PremiumBadge; 