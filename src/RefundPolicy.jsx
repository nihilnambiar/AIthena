import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, X, AlertCircle, CheckCircle } from "lucide-react";
import MoodBackgrounds from "./MoodBackgrounds.jsx";

const RefundPolicy = () => {
  const navigate = useNavigate();

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
          <div className="w-full max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <h1 className="text-4xl font-bold text-center mb-8 text-white">
                Refund & Cancellation Policy
              </h1>
              
              <div className="space-y-8 text-lg leading-relaxed">
                {/* No Refunds Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h2 className="text-2xl font-bold text-red-400 mb-3">No Refunds</h2>
                      <p className="text-white/90">
                        DreamDive Premium subscriptions are non-refundable. Once you subscribe to our premium service, 
                        we do not provide refunds for any reason, including but not limited to:
                      </p>
                      <ul className="mt-4 space-y-2 text-white/80">
                        <li>• Unused portion of your subscription period</li>
                        <li>• Dissatisfaction with the service</li>
                        <li>• Technical issues or service interruptions</li>
                        <li>• Change of mind after purchase</li>
                        <li>• Account cancellation</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Cancellation Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h2 className="text-2xl font-bold text-green-400 mb-3">Subscription Cancellation</h2>
                      <p className="text-white/90 mb-4">
                        You can cancel your DreamDive Premium subscription at any time. Here's what you need to know:
                      </p>
                      <ul className="space-y-3 text-white/80">
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 font-bold">•</span>
                          <span><strong>Immediate Cancellation:</strong> You can cancel your subscription immediately through your account settings or by contacting our support team.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 font-bold">•</span>
                          <span><strong>Access Until End of Period:</strong> You will continue to have access to premium features until the end of your current billing period.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 font-bold">•</span>
                          <span><strong>No Further Charges:</strong> Once cancelled, you will not be charged for future billing periods.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 font-bold">•</span>
                          <span><strong>Data Retention:</strong> Your dream data and account information will be retained according to our privacy policy.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* How to Cancel Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">How to Cancel Your Subscription</h2>
                  <div className="space-y-4 text-white/90">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Method 1: Through Your Account</h3>
                      <ol className="list-decimal list-inside space-y-2 text-white/80 ml-4">
                        <li>Log into your DreamDive account</li>
                        <li>Go to your account settings</li>
                        <li>Navigate to the "Subscription" section</li>
                        <li>Click "Cancel Subscription"</li>
                        <li>Confirm your cancellation</li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Method 2: Contact Support</h3>
                      <p className="text-white/80">
                        If you're unable to cancel through your account, please contact our support team at{' '}
                        <a href="mailto:support@dreamdive.app" className="text-blue-400 underline hover:text-blue-300">
                          support@dreamdive.app
                        </a>
                        {' '}and we'll assist you with the cancellation process.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Pricing Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">Pricing Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">Monthly Plan</h3>
                      <p className="text-3xl font-bold text-purple-400">$10<span className="text-lg text-white/60">/month</span></p>
                      <p className="text-white/80 mt-2">Billed monthly, cancel anytime</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">Annual Plan</h3>
                      <p className="text-3xl font-bold text-purple-400">$7<span className="text-lg text-white/60">/month</span></p>
                      <p className="text-white/80 mt-2">Billed annually at $84, save $36/year</p>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center bg-white/5 rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Questions?</h2>
                  <p className="text-white/90 mb-4">
                    If you have any questions about our refund and cancellation policy, 
                    please don't hesitate to contact us.
                  </p>
                  <a 
                    href="mailto:support@dreamdive.app"
                    className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
                  >
                    Contact Support
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RefundPolicy; 