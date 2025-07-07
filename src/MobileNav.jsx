// src/MobileNav.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthContext";

const MobileNav = ({ isOpen, setIsOpen, openJournal, openPremium }) => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed top-0 right-0 w-64 h-full bg-white/10 backdrop-blur-md text-white shadow-lg z-50 p-6 flex flex-col gap-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">DreamDive 🌙</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <button
            onClick={() => {
              openJournal();
              setIsOpen(false);
            }}
            className="bg-indigo-500 hover:bg-indigo-600 w-full py-2 rounded-xl font-semibold transition"
          >
            Open Journal
          </button>

          <button
            onClick={() => {
              openPremium();
              setIsOpen(false);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 w-full py-2 rounded-xl font-semibold text-black transition"
          >
            Go Premium
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 w-full py-2 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
