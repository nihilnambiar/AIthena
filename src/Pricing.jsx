import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, X, Crown, Check, Star, Sparkles, Users, Share2, Award, Zap } from "lucide-react";
import MoodBackgrounds from "./MoodBackgrounds.jsx";

const Pricing = () => {
  const navigate = useNavigate();

  const features = [
    { label: "Unlimited dream interpretations", premium: true, icon: Sparkles, description: "No daily limits on dream analysis" },
    { label: "Advanced AI dream analysis", premium: true, icon: Star, description: "Deep psychological insights and symbolism" },
    { label: "Symbolism & emotional trend analysis", premium: true, icon: Crown, description: "Detailed breakdown of dream elements" },
    { label: "Dream sharing with social cards", premium: true, icon: Share2, description: "Beautiful cards for social media sharing" },
    { label: "Private premium community forum", premium: true, icon: Users, description: "Connect with fellow dream explorers" },
    { label: "Exclusive premium badge", premium: true, icon: Award, description: "Show off your premium status" },
    { label: "Priority support", premium: true, icon: Zap, description: "Faster responses and dedicated help" },
    { label: "Basic dream interpretations", premium: false, icon: Check, description: "Limited to 4 per day" },
    { label: "Save dreams locally", premium: false, icon: Check, description: "Basic dream journaling" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white relative overflow-hidden">
      <MoodBackgrounds mood="Peaceful" />
      
      {/* Dark overlay for focus */}
      <div className="fixed inset-0 bg-black/60 z-0 pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          
          <motion.button
            onClick={() => navigate("/")}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex items-center justify-center px-4 py-8"
        >
          <div className="w-full max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl font-bold mb-4 text-white">
                DreamDive Pricing
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Choose the perfect plan for your dream exploration journey. 
                Start free and upgrade when you're ready for deeper insights.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-white">Free Plan</h2>
                  <div className="flex items-end justify-center gap-2 mb-6">
                    <span className="text-6xl font-bold text-white">₹0</span>
                    <span className="text-xl text-white/60 mb-2">/month</span>
                  </div>
                  <p className="text-white/80 mb-6">Perfect for getting started with dream interpretation</p>
                  <motion.button
                    onClick={() => navigate("/dream")}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Started Free
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">What's Included:</h3>
                  {features.filter(f => !f.premium).map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3 text-green-400"
                    >
                      <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">{feature.label}</span>
                        <p className="text-white/60 text-sm mt-1">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Premium Plan */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-2xl rounded-3xl p-8 border-2 border-yellow-400 shadow-2xl relative"
              >
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <Crown className="w-4 h-4" />
                    MOST POPULAR
                  </div>
                </motion.div>

                <div className="text-center mb-8 mt-4">
                  <h2 className="text-3xl font-bold mb-4 text-white">Premium Plan</h2>
                  
                  {/* Pricing Options */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-end justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-white">₹799</span>
                        <span className="text-lg text-white/60 mb-1">/month</span>
                      </div>
                      <p className="text-white/80 text-sm">Billed monthly</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
                      <div className="flex items-end justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-green-400">₹599</span>
                        <span className="text-lg text-white/60 mb-1">/month</span>
                      </div>
                      <p className="text-white/80 text-sm">Billed annually at ₹7,188</p>
                      <p className="text-green-400 text-sm font-semibold">Save ₹2,400/year vs monthly!</p>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => navigate("/premium")}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 rounded-xl transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Crown className="w-5 h-5 inline mr-2" />
                    Upgrade to Premium
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white mb-4">Everything in Free, Plus:</h3>
                  {features.filter(f => f.premium).map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 text-green-400"
                    >
                      <feature.icon className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">{feature.label}</span>
                        <p className="text-white/60 text-sm mt-1">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid md:grid-cols-3 gap-6"
            >
              <div className="bg-white/5 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Cancel Anytime</h3>
                <p className="text-white/80">No long-term commitments. Cancel your subscription whenever you want.</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure Payments</h3>
                <p className="text-white/80">All payments are processed securely through trusted payment providers.</p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Instant Access</h3>
                <p className="text-white/80">Get immediate access to all premium features after your payment is confirmed.</p>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 bg-white/5 rounded-3xl p-8"
            >
              <h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Can I switch between plans?</h3>
                  <p className="text-white/80">Yes, you can upgrade or downgrade your plan at any time through your account settings.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">What payment methods do you accept?</h3>
                  <p className="text-white/80">We accept all major credit cards, debit cards, and digital wallets through our secure payment processor.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Is there a free trial?</h3>
                  <p className="text-white/80">We offer a free plan with basic features. You can upgrade to premium anytime to unlock advanced features.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">What happens if I cancel?</h3>
                  <p className="text-white/80">You'll continue to have access to premium features until the end of your current billing period.</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
              <p className="text-white/80 mb-6">
                Our support team is here to help you choose the right plan for your needs.
              </p>
              <a 
                href="mailto:nihil@thedreamdive.com"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
              >
                Contact Support
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Add missing Shield icon component
const Shield = ({ className, ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default Pricing; 