import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

const BottomDrawer = ({ openJournal, openPremium, isHidden }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
        isHidden ? "opacity-0 pointer-events-none scale-95" : "opacity-100 pointer-events-auto scale-100"
      }`}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-xl px-4 py-2 flex items-center space-x-2"
      >
        <button
          onClick={openJournal}
          className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-full flex items-center gap-2 text-sm"
        >
          <BookOpen className="w-5 h-5" />
          Open Journal
        </button>

        <button
          onClick={openPremium}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-600 py-2 px-4 rounded-full flex items-center gap-2 text-sm font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Go Premium
        </button>
      </motion.div>
    </div>
  );
};

export default BottomDrawer;
