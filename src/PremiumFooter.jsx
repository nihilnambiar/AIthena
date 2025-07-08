import React from "react";

export const PremiumFooter = () => (
  <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-xl bg-black/40 text-white/80 text-sm shadow-lg backdrop-blur-md select-none border border-white/20" style={{maxWidth: 600, fontWeight: 400, letterSpacing: '0.01em'}}>
    <div className="flex flex-wrap items-center justify-center gap-4 text-center">
      <span>&copy; 2025 DreamDive</span>
      <span className="hidden sm:inline">•</span>
      <a href="/terms" className="underline hover:text-white transition-colors">Terms</a>
      <span>•</span>
      <a href="/privacy" className="underline hover:text-white transition-colors">Privacy</a>
      <span>•</span>
      <a href="/refund-policy" className="underline hover:text-white transition-colors">Refund Policy</a>
      <span>•</span>
      <a href="/pricing" className="underline hover:text-white transition-colors">Pricing</a>
    </div>
  </footer>
); 