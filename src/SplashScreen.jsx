import React, { useEffect } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onFinish = () => {} }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-indigo-950 to-purple-900 flex flex-col items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 20, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <span className="text-4xl">🌙</span>
        </motion.div>
        <h1 className="text-3xl font-bold mt-2 text-white drop-shadow-lg">DreamDive</h1>
        <p className="text-sm text-white/60 mt-1 italic">Decode the language of your dreams</p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
