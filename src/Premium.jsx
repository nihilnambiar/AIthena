// src/Premium.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import confetti from "canvas-confetti";
import MoodBackgrounds from "./MoodBackgrounds.jsx";
import FloatingIcons from "./FloatingIcons.jsx";
import { useAuth } from "./AuthContext";
import { Crown, Users, Share2, Award, Sparkles, Zap, Check, Star, ArrowRight, X } from "lucide-react";
import { PremiumFooter } from "./PremiumFooter";

const features = [
  { label: "Unlimited dream interpretations", premium: true, icon: "🌙", description: "No daily limits on dream analysis" },
  { label: "Advanced AI dream analysis", premium: true, icon: "🧠", description: "Deep psychological insights and symbolism" },
  { label: "Symbolism & emotional trend analysis", premium: true, icon: "🔮", description: "Detailed breakdown of dream elements" },
  { label: "Dream sharing with social cards", premium: true, icon: "📱", description: "Beautiful cards for social media sharing" },
  { label: "Private premium community forum", premium: true, icon: "👥", description: "Connect with fellow dream explorers" },
  { label: "Exclusive premium badge", premium: true, icon: "🏆", description: "Show off your premium status" },
  { label: "Priority support", premium: true, icon: "⚡", description: "Faster responses and dedicated help" },
  { label: "Basic dream interpretations", premium: false, icon: "📝", description: "Limited to 4 per day" },
  { label: "Save dreams locally", premium: false, icon: "💾", description: "Basic dream journaling" },
];

const Premium = ({ setUser }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly'); // 'monthly' or 'annual'
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  const handlePayment = useCallback(async () => {
    const monthlyPrice = 1000; // $10.00 in cents
    const annualPrice = 8400; // $84.00 in cents (7 * 12 = $84)
    const amount = selectedPlan === 'annual' ? annualPrice : monthlyPrice;
    
    setIsProcessing(true);
    
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay Key ID
      amount: amount,
      currency: "USD",
      name: "DreamDive Premium",
      description: `Unlock unlimited dream insights 🌙 (${selectedPlan === 'annual' ? 'Annual Plan' : 'Monthly Plan'})`,
      image: "/logo512.png",
      handler: async function (response) {
        try {
          const userRef = doc(db, "users", user?.uid);
          await updateDoc(userRef, { 
            premium: true,
            premiumPlan: selectedPlan,
            premiumStartDate: new Date(),
            premiumEndDate: selectedPlan === 'annual' 
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 1 month
          });
          // Refetch user info and update context
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const updatedUser = { ...user, ...snap.data() };
            if (typeof setUser === 'function') setUser(updatedUser);
          }
          
          // Enhanced confetti effect
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#8b5cf6', '#a855f7']
          });
          
          setShowThankYou(true);
        } catch (err) {
          console.error("Upgrade failed", err);
          alert("Something went wrong.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#6366f1",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  }, [selectedPlan, user, setUser]);

  const planDetails = useMemo(() => ({
    monthly: {
      price: 10,
      total: 10,
      period: 'month',
      savings: 0
    },
    annual: {
      price: 7,
      total: 84,
      period: 'month',
      savings: 36
    }
  }), []);

  const currentPlan = planDetails[selectedPlan];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white px-4 relative overflow-hidden">
      {/* Animated/gradient background elements */}
      <MoodBackgrounds mood="Peaceful" />
      <FloatingIcons />
      {/* Dark overlay for focus */}
      <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none" />
      
      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border border-white/30"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-6xl mb-6"
              >
                🌟
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-3 text-center">Welcome to DreamDive Premium!</h2>
              <p className="text-white/80 text-center mb-8 leading-relaxed">Enjoy exclusive features and advanced dream insights. Your journey to deeper dream understanding starts now!</p>
              <motion.button
                onClick={() => { setShowThankYou(false); navigate("/"); }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-5 h-5" />
                Start Dreaming
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center"
      >
        {/* Free Plan Card */}
        <motion.div 
          className="flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-xl flex flex-col items-center min-w-[320px] max-w-sm relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <h2 className="text-2xl font-bold mb-3 text-white text-center">Free</h2>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-5xl font-bold text-white">$0</span>
            <span className="text-lg text-white/60 mb-1">/month</span>
          </div>
          {(!user?.premium) && (
            <motion.span 
              className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              Your current plan
            </motion.span>
          )}
          <ul className="w-full mb-8 space-y-4 text-base">
            {features.filter(f => !f.premium).map((f, i) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-3 text-green-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{f.label}</span>
                  <p className="text-white/60 text-sm mt-1">{f.description}</p>
                </div>
              </motion.li>
            ))}
            {features.filter(f => f.premium).map((f, i) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-3 text-white/40 line-through"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <X className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{f.label}</span>
                  <p className="text-white/30 text-sm mt-1">{f.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Premium Plan Card */}
        <motion.div 
          className="flex-1 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-yellow-400 shadow-2xl flex flex-col items-center min-w-[320px] max-w-sm relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <motion.div 
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
              <Crown className="w-4 h-4" />
              PRO
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-3 text-white text-center mt-4">Premium</h2>
          
          {/* Plan Selection */}
          <div className="flex bg-white/10 rounded-xl p-1 mb-6">
            <motion.button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition relative ${
                selectedPlan === 'monthly' 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-white/70 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Monthly
            </motion.button>
            <motion.button
              onClick={() => setSelectedPlan('annual')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition relative ${
                selectedPlan === 'annual' 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-white/70 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Annual
              {selectedPlan === 'annual' && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  Save 20%
                </motion.span>
              )}
            </motion.button>
          </div>
          
          <div className="flex items-end gap-1 mb-2">
            <span className="text-6xl font-bold text-white">
              ${currentPlan.price}
            </span>
            <span className="text-xl text-white/60 mb-1">/{currentPlan.period}</span>
          </div>
          
          {selectedPlan === 'annual' && (
            <motion.p 
              className="text-yellow-400 text-sm mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Billed annually at ${currentPlan.total}
            </motion.p>
          )}
          
          {(user?.premium) && (
            <motion.span 
              className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              Your current plan
            </motion.span>
          )}
          
          <ul className="w-full mb-8 space-y-4 text-base">
            {features.filter(f => f.premium).map((f, i) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-3 text-green-400"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{f.label}</span>
                  <p className="text-white/60 text-sm mt-1">{f.description}</p>
                </div>
              </motion.li>
            ))}
            {features.filter(f => !f.premium).map((f, i) => (
              <motion.li 
                key={i} 
                className="flex items-start gap-3 text-white/40"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <Check className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium">{f.label}</span>
                  <p className="text-white/30 text-sm mt-1">{f.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
          
          <motion.button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 rounded-xl transition shadow-lg text-lg mb-3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={user?.premium || isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Crown className="w-5 h-5" />
            {isProcessing ? 'Processing...' : user?.premium ? 'Already Premium' : 'Upgrade Now'}
          </motion.button>
          
          <motion.button
            onClick={() => navigate("/dream")}
            className="w-full mt-2 text-white/70 hover:text-white text-sm underline flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <ArrowRight className="w-4 h-4" />
            Back to DreamDive
          </motion.button>
        </motion.div>

        {/* Features Highlight */}
        <motion.div 
          className="flex-1 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-xl min-w-[320px] max-w-sm"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center text-yellow-400 flex items-center justify-center gap-2">
            <Star className="w-6 h-6" />
            Premium Features
          </h3>
          
          <div className="space-y-6">
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Advanced Dream Analysis</h4>
                <p className="text-white/70 text-sm leading-relaxed">Deep symbolism analysis and emotional trend tracking with AI insights</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-3 rounded-xl">
                <Share2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Dream Sharing</h4>
                <p className="text-white/70 text-sm leading-relaxed">Share your dream interpretations with beautiful social cards</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Premium Community</h4>
                <p className="text-white/70 text-sm leading-relaxed">Join our private forum for dream discussions and experiences</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-3 rounded-xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Exclusive Badge</h4>
                <p className="text-white/70 text-sm leading-relaxed">Show off your premium status with an exclusive badge</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 p-3 rounded-xl">
                <Zap className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Priority Support</h4>
                <p className="text-white/70 text-sm leading-relaxed">Get faster responses and dedicated customer support</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      <PremiumFooter />
    </div>
  );
};

export default Premium;
