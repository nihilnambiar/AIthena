import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Netlify will reload the page by default, so we intercept and show a thank you message
  const handleNetlifySubmit = (e) => {
    e.preventDefault();
    // Optionally, you can use FormData and fetch to submit via AJAX to Netlify, but for now, just show thank you
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
    // Actually submit the form (uncomment for AJAX):
    // const data = new FormData(e.target);
    // fetch('/', { method: 'POST', body: data });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X size={24} />
          </button>

          {isSubmitted ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p>Your feedback helps us make DreamDive better.</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Share Your Thoughts</h2>
              <form 
                name="feedback" 
                method="POST" 
                data-netlify="true" 
                netlify-honeypot="bot-field"
                onSubmit={handleNetlifySubmit}
              >
                {/* Netlify bot-field for spam prevention */}
                <input type="hidden" name="form-name" value="feedback" />
                <p style={{ display: 'none' }}>
                  <label>
                    Don't fill this out: <input name="bot-field" />
                  </label>
                </p>
                <textarea
                  name="feedback"
                  placeholder="Tell us what you think, or any ideas you have..."
                  className="w-full h-32 p-3 rounded-xl bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 border-none resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-xl text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition"
                >
                  Send Feedback
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal; 