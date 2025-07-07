import React from "react";

export const LegalFooter = () => (
  <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 px-6 py-2 rounded-xl bg-black/30 text-white/80 text-sm shadow-lg backdrop-blur-md select-none" style={{maxWidth: 480, fontWeight: 400, letterSpacing: '0.01em'}}>
    &copy; 2025 DreamDive &middot; <a href="/terms" className="underline hover:text-white ml-2">Terms</a> &middot; <a href="/privacy" className="underline hover:text-white ml-2">Privacy</a>
  </footer>
);
