import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, actions = [] }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-purple-200/90 to-blue-100/90 border border-purple-400/30 rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center relative animate-fade-in"
          onClick={e => e.stopPropagation()}
          style={{backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)'}}
        >
          <button className="absolute top-4 right-4 text-purple-900 hover:text-purple-700" onClick={onClose} aria-label="Close"><X className="w-6 h-6" /></button>
          {title && <h2 className="text-2xl font-bold text-purple-900 mb-2 text-center">{title}</h2>}
          <div className="mb-6 w-full text-center text-purple-800">{children}</div>
          <div className="flex gap-3 w-full">
            {actions.map((action, i) => (
              <button
                key={i}
                className={
                  action.style ||
                  "flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg shadow-lg transition"
                }
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal; 