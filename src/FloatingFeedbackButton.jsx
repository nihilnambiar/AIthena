import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackModal from './FeedbackModal';

const FloatingFeedbackButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonVariants = {
    rest: {
      scale: 1,
      boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 6px 30px rgba(0,0,0,0.2)",
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center flex-row-reverse"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open feedback form"
      >
        <motion.div
          variants={buttonVariants}
          initial="rest"
          animate={isHovered ? "hover" : "rest"}
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full cursor-pointer"
        >
          <MessageSquarePlus size={28} />
        </motion.div>
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
              className="mr-3 px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg font-semibold whitespace-nowrap"
            >
              Share your thoughts?
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FloatingFeedbackButton; 