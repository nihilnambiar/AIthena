import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile,
  CloudSun,
  Ghost,
  Heart,
  Laugh,
  Meh,
  Frown,
  ChevronDown,
  Sparkles
} from "lucide-react"; 

const moods = [
  { label: "Peaceful", icon: <CloudSun size={18} /> },
  { label: "Weird", icon: <Ghost size={18} /> },
  { label: "Scary", icon: <Frown size={18} /> },
  { label: "Romantic", icon: <Heart size={18} /> },
  { label: "Confusing", icon: <Meh size={18} /> },
  { label: "Funny", icon: <Laugh size={18} /> },
  { label: "Spiritual", icon: <Sparkles size={18} /> } 
];

const MoodDropdown = ({ mood, setMood }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = moods.find((m) => m.label === (mood?.label || mood));

  return (
    <div className="relative w-full z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-lg"
      >
        <span className="flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={selected?.label || "none"}
              initial={{ opacity: 0, y: 8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="inline-flex"
            >
              {selected?.icon || <Smile size={18} />}
            </motion.span>
          </AnimatePresence>
          {selected?.label || "Choose your mood"}
        </span>
        <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute mt-2 w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 text-white"
          >
            {moods.map((moodItem) => (
              <li
                key={moodItem.label}
                onClick={() => {
                  setMood(moodItem);
                  setIsOpen(false);
                }}
                className="px-4 py-3 hover:bg-white/20 transition-colors cursor-pointer flex items-center gap-2 text-sm"
              >
                {moodItem.icon}
                {moodItem.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodDropdown;
