import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Share2, Download, Copy, Check, Sparkles, Crown, X } from "lucide-react";
import confetti from "canvas-confetti";

// Full view modal for the dream/interpretation
function FullDreamModal({ open, onClose, dream, interpretation, mood }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-purple-700 via-blue-700 to-indigo-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/20 text-white p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl hover:bg-white/10 p-1 rounded-full transition" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block text-2xl">🌙</span>
          <span className="font-bold text-xl">DreamDive</span>
          <Crown className="w-5 h-5 text-yellow-400" />
          <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">{mood}</span>
        </div>
        <div className="mb-6">
          <h3 className="font-semibold text-base text-purple-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> DREAM
          </h3>
          <div className="whitespace-pre-line text-white/90 text-base leading-relaxed break-words">
            {dream}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-base text-purple-200 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> INTERPRETATION
          </h3>
          <div className="whitespace-pre-line text-white/90 text-base leading-relaxed break-words">
            {interpretation}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-white/20 text-xs text-white/70 text-center">
          Powered by <span className="font-bold">thedreamdive.com</span>
        </div>
      </div>
    </div>
  );
}

const gradients = [
  { value: 'from-purple-600 via-blue-600 to-indigo-700', label: 'Purple-Blue' },
  { value: 'from-pink-500 via-red-500 to-yellow-500', label: 'Pink-Red-Yellow' },
  { value: 'from-green-400 via-blue-500 to-purple-600', label: 'Green-Blue-Purple' },
  { value: 'from-gray-800 via-gray-700 to-gray-900', label: 'Dark Gray' },
];

const DreamShareCard = ({ dream, interpretation, mood, onClose, dreamId }) => {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  // Customization state
  const [bgIndex, setBgIndex] = useState(0);
  const bgGradient = gradients[bgIndex].value;
  // Full view modal state
  const [showFull, setShowFull] = useState(false);

  // Swipe gesture handlers
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) setBgIndex(i => (i + 1) % gradients.length); // swipe left
      else setBgIndex(i => (i - 1 + gradients.length) % gradients.length); // swipe right
    }
    touchStartX.current = null;
  };

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
      });
      const link = document.createElement('a');
      link.download = `dreamdive-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#92400e']
      });
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (error) {
      console.error('Error generating card:', error);
      alert('Failed to generate card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Shareable link
  const shareLink = dreamId ? `${window.location.origin}/share/dream/${dreamId}` : window.location.origin;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#a855f7', '#c084fc']
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy to clipboard');
    }
  }, [shareLink]);

  const shareOnSocial = useCallback((platform) => {
    const text = `🌙 DreamDive\n\nDream: ${dream}\nMood: ${mood}\n\nInterpretation: ${interpretation}\n\n#DreamDive #DreamAnalysis #DreamInterpretation`;
    const url = window.location.origin;
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  }, [dream, interpretation, mood]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20 text-white relative"
        >
          {/* Customization Controls */}
          <div className="p-4 border-b border-white/10 bg-black/10 flex flex-col gap-2">
            <div className="flex gap-4 items-center justify-center">
              <div className="flex flex-col items-center">
                <label className="text-xs font-semibold text-white/70 mb-1">Background</label>
                <select value={bgGradient} onChange={e => setBgIndex(gradients.findIndex(g => g.value === e.target.value))}
                  className="rounded-xl px-3 py-2 bg-white/10 border border-white/20 text-white/90 focus:ring-2 focus:ring-purple-400 focus:outline-none transition shadow-sm backdrop-blur-md"
                  style={{ minWidth: 140 }}
                >
                  {gradients.map((g, i) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Success Overlay */}
          <AnimatePresence>
            {shareSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-green-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10"
              >
                <div className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Shared Successfully!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <motion.span
                      className="inline-block"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >🌙</motion.span>
                    DreamDive
                  </h2>
                  <p className="text-white/70 text-sm">Create beautiful social cards</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white text-2xl hover:bg-white/10 p-1 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          {/* Share Card Preview */}
          <div className="p-6">
            <motion.div
              ref={cardRef}
              className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden border border-white/20 cursor-pointer`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => setShowFull(true)}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                {/* No emoji in corner */}
                <motion.div 
                  className="absolute bottom-4 left-4 text-3xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✨
                </motion.div>
                <motion.div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-5"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  💫
                </motion.div>
              </div>
              {/* Content */}
              <div className="relative z-10 max-h-[40vh] md:max-h-[48vh] overflow-y-auto pr-1 custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <motion.span
                      className="inline-block"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >🌙</motion.span>
                    <span className="font-bold text-lg">DreamDive</span>
                    <Crown className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {mood}
                  </div>
                </div>
                {/* Dream Text */}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-purple-200 mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    DREAM
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {dream.length > 150 ? dream.substring(0, 150) + '...' : dream}
                    {dream.length > 150 && (
                      <span className="text-blue-200 underline ml-2 cursor-pointer">Read more</span>
                    )}
                  </p>
                </div>
                {/* Interpretation */}
                <div>
                  <h3 className="font-semibold text-sm text-purple-200 mb-2 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    INTERPRETATION
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {interpretation.length > 200 ? interpretation.substring(0, 200) + '...' : interpretation}
                    {interpretation.length > 200 && (
                      <span className="text-blue-200 underline ml-2 cursor-pointer">Read more</span>
                    )}
                  </p>
                </div>
                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs text-white/70">Powered by <span className="font-bold">thedreamdive.com</span></span>
                </div>
              </div>
            </motion.div>
          </div>
          {/* Action Buttons */}
          <div className="p-6 border-t border-white/10 space-y-3">
            {/* Download */}
            <motion.button
              onClick={downloadCard}
              disabled={isGenerating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Download Card'}
            </motion.button>
            {/* Copy Link */}
            <motion.button
              onClick={copyToClipboard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </motion.button>
            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={() => shareOnSocial('twitter')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                Twitter
              </motion.button>
              <motion.button
                onClick={() => shareOnSocial('facebook')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                Facebook
              </motion.button>
              <motion.button
                onClick={() => shareOnSocial('whatsapp')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                WhatsApp
              </motion.button>
              <motion.button
                onClick={() => shareOnSocial('linkedin')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                LinkedIn
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <FullDreamModal open={showFull} onClose={() => setShowFull(false)} dream={dream} interpretation={interpretation} mood={mood} />
    </AnimatePresence>
  );
};

export default DreamShareCard; 