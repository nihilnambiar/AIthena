// FloatingIcons.jsx
import React from "react";
import { motion } from "framer-motion";

const icons = ["🌙", "💭", "🌀", "⭐", "🌌", "🛌"];

const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {icons.map((icon, index) => {
        const randomLeft = Math.random() * 100;
        const randomDuration = 10 + Math.random() * 10;

        return (
          <motion.div
            key={index}
            className="absolute text-4xl opacity-20"
            initial={{ y: "100vh", x: `${randomLeft}%` }}
            animate={{ y: "-10vh" }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: index * 2,
            }}
            style={{ left: `${randomLeft}%` }}
          >
            {icon}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;
