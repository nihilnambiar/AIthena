import React, { useMemo } from "react";

// Peaceful
const Stars = () => {
  const stars = useMemo(() =>
    [...Array(40)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 8,
    })), []
  );
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-40 blur-[1.5px] animate-float"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const Mist = () => (
  <div className="absolute inset-0 z-0 bg-gradient-to-b from-red-900 via-black to-gray-900 opacity-30 animate-fade pointer-events-none" />
);

const Hearts = () => {
  const hearts = useMemo(() =>
    [...Array(10)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.5,
    })), []
  );
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {hearts.map((heart, i) => (
        <div
          key={i}
          className="absolute text-pink-300 text-2xl animate-float"
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          💕
        </div>
      ))}
    </div>
  );
};

// --- Add Rainbow helper ---
const FunnyRainbow = () => (
  <div className="absolute left-1/2 top-[18%] -translate-x-1/2 z-10 pointer-events-none">
    <svg width="420" height="120" viewBox="0 0 420 120" fill="none">
      <defs>
        <radialGradient id="rainbow-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="110" rx="180" ry="40" fill="url(#rainbow-glow)" />
      <path d="M30 110 Q210 -40 390 110" stroke="#f87171" strokeWidth="16" fill="none" />
      <path d="M50 110 Q210 -20 370 110" stroke="#fbbf24" strokeWidth="14" fill="none" />
      <path d="M70 110 Q210 0 350 110" stroke="#34d399" strokeWidth="12" fill="none" />
      <path d="M90 110 Q210 20 330 110" stroke="#60a5fa" strokeWidth="10" fill="none" />
      <path d="M110 110 Q210 40 310 110" stroke="#a78bfa" strokeWidth="8" fill="none" />
    </svg>
  </div>
);

// --- Add Balloons helper ---
const FunnyBalloons = () => {
  const balloons = useMemo(() =>
    [...Array(7)].map((_, i) => ({
      left: Math.random() * 100,
      top: 60 + Math.random() * 30,
      color: ["#f87171","#fbbf24","#34d399","#60a5fa","#a78bfa"][i%5],
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 8,
      size: 32 + Math.random() * 24
    })), []
  );
  return (
    <>
      {balloons.map((b, i) => (
        <div
          key={i}
          className="absolute animate-funny-balloon pointer-events-none"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: `${b.size}px`,
            height: `${b.size*1.3}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            zIndex: 8
          }}
        >
          <svg viewBox="0 0 24 32" fill="none">
            <ellipse cx="12" cy="14" rx="10" ry="14" fill={b.color} />
            <path d="M12 28 Q13 30 12 32 Q11 30 12 28" stroke="#888" strokeWidth="1.2" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes funny-balloon {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-40px) scale(1.05); opacity: 1; }
          100% { transform: translateY(-80px) scale(1) rotate(-2deg); opacity: 0.7; }
        }
        .animate-funny-balloon {
          animation: funny-balloon linear infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Party Hats helper ---
const FunnyPartyHats = () => {
  const hats = useMemo(() =>
    [...Array(5)].map((_, i) => ({
      left: Math.random() * 100,
      top: 10 + Math.random() * 60,
      color: ["#fbbf24","#f87171","#60a5fa","#a78bfa","#34d399"][i%5],
      delay: Math.random() * 8,
      size: 22 + Math.random() * 16
    })), []
  );
  return (
    <>
      {hats.map((h, i) => (
        <div
          key={i}
          className="absolute animate-funny-hat pointer-events-none"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            width: `${h.size}px`,
            height: `${h.size*1.2}px`,
            animationDelay: `${h.delay}s`,
            zIndex: 9
          }}
        >
          <svg viewBox="0 0 20 24" fill="none">
            <polygon points="10,2 2,22 18,22 16,20 18,18 16,16 18,14 16,12 18,10 16,8 18,6 16,4 18,2" fill={h.color} />
            <circle cx="10" cy="2" r="2" fill="#fff" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes funny-hat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.1) rotate(-6deg); }
        }
        .animate-funny-hat {
          animation: funny-hat 7s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Comic Bursts helper ---
const FunnyBursts = () => {
  const bursts = useMemo(() =>
    [...Array(6)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: ["#fff","#fbbf24","#f87171","#60a5fa","#a78bfa"][i%5],
      delay: Math.random() * 8,
      size: 32 + Math.random() * 32
    })), []
  );
  return (
    <>
      {bursts.map((b, i) => (
        <div
          key={i}
          className="absolute animate-funny-burst pointer-events-none"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${b.delay}s`,
            zIndex: 12
          }}
        >
          <svg viewBox="0 0 32 32" fill="none">
            <polygon points="16,0 20,12 32,12 22,20 26,32 16,24 6,32 10,20 0,12 12,12" fill={b.color} />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes funny-burst {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
          50% { transform: scale(1.2) rotate(12deg); opacity: 1; }
        }
        .animate-funny-burst {
          animation: funny-burst 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Haha Text helper ---
const FunnyHaha = () => {
  const has = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      size: 18 + Math.random() * 18,
      rotate: Math.random() * 40 - 20
    })), []
  );
  return (
    <>
      {has.map((h, i) => (
        <div
          key={i}
          className="absolute text-yellow-400 font-bold animate-funny-haha pointer-events-none"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            fontSize: `${h.size}px`,
            animationDelay: `${h.delay}s`,
            transform: `rotate(${h.rotate}deg)`
          }}
        >
          haha!
        </div>
      ))}
      <style>{`
        @keyframes funny-haha {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-funny-haha {
          animation: funny-haha 7s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Enhanced FunnyBG ---
const FunnyBG = () => {
  const emojis = useMemo(() => [
    "😂", "🤣", "😹", "😜", "🤪", "😆", "🥳", "🦄", "🎉", "🍕", "😝", "😛", "😸", "😺", "😻", "🧁", "🍦", "🍭", "🍉", "🍩"
  ].map((emoji, i) => ({
    emoji,
    left: Math.random() * 90,
    top: Math.random() * 80,
    delay: i * 0.3 + Math.random() * 0.4,
    spin: Math.random() > 0.5,
    pop: Math.random() > 0.5
  })), []);
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Animated bright gradient */}
      <div className="absolute inset-0 w-full h-full animate-funny-gradient bg-gradient-to-br from-yellow-200 via-pink-300 to-orange-200 opacity-95" />
      {/* Balloons */}
      <FunnyBalloons />
      {/* Party hats */}
      <FunnyPartyHats />
      {/* Comic bursts */}
      <FunnyBursts />
      {/* Haha text */}
      <FunnyHaha />
      {/* Playful emojis with wiggle, spin, pop */}
      {emojis.map(({ emoji, left, top, delay, spin, pop }, i) => (
        <div
          key={i}
          className={`absolute text-3xl animate-funny-wiggle${spin ? ' animate-funny-spin' : ''}${pop ? ' animate-funny-pop' : ''}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            zIndex: 10
          }}
        >
          {emoji}
        </div>
      ))}
      {/* Confetti */}
      {[...Array(32)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-funny-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${6 + Math.random() * 10}px`,
            height: `${6 + Math.random() * 10}px`,
            background: `hsl(${Math.random()*360},90%,70%)`,
            opacity: 0.7,
            animationDelay: `${Math.random() * 8}s`,
            zIndex: 6
          }}
        />
      ))}
      <style>{`
        @keyframes funny-gradient {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(30deg) brightness(1.05); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        .animate-funny-gradient {
          animation: funny-gradient 18s ease-in-out infinite;
        }
        @keyframes funny-wiggle {
          0%, 100% { transform: rotate(-3deg) scale(1); }
          20% { transform: rotate(3deg) scale(1.03); }
          40% { transform: rotate(-2deg) scale(1.01); }
          60% { transform: rotate(2deg) scale(1.03); }
          80% { transform: rotate(-1deg) scale(1.01); }
        }
        .animate-funny-wiggle {
          animation: funny-wiggle 7s infinite;
        }
        @keyframes funny-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-funny-spin {
          animation: funny-spin 4s linear infinite;
        }
        @keyframes funny-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .animate-funny-pop {
          animation: funny-pop 1.2s ease-in-out infinite;
        }
        @keyframes funny-confetti {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          80% { transform: translateY(40px) scale(1.1); opacity: 1; }
          100% { transform: translateY(60px) scale(0.9); opacity: 0; }
        }
        .animate-funny-confetti {
          animation: funny-confetti 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- Add Geometric Shapes helper ---
const WeirdShapes = () => {
  const shapes = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      type: ['triangle', 'circle', 'hexagon'][i % 3],
      color: ["#fbbf24","#f87171","#60a5fa","#a78bfa","#34d399","#f59e0b"][i % 6],
      delay: Math.random() * 8,
      size: 24 + Math.random() * 32,
      rotate: Math.random() * 360
    })), []
  );
  return (
    <>
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute animate-weird-shape pointer-events-none"
          style={{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDelay: `${shape.delay}s`,
            zIndex: 8
          }}
        >
          {shape.type === 'triangle' && (
            <svg viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,20 2,20" fill={shape.color} fillOpacity="0.6" />
            </svg>
          )}
          {shape.type === 'circle' && (
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill={shape.color} fillOpacity="0.6" />
            </svg>
          )}
          {shape.type === 'hexagon' && (
            <svg viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 20,8 20,16 12,22 4,16 4,8" fill={shape.color} fillOpacity="0.6" />
            </svg>
          )}
        </div>
      ))}
      <style>{`
        @keyframes weird-shape {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
          25% { transform: scale(1.2) rotate(90deg); opacity: 0.8; }
          50% { transform: scale(0.8) rotate(180deg); opacity: 0.4; }
          75% { transform: scale(1.1) rotate(270deg); opacity: 0.7; }
        }
        .animate-weird-shape {
          animation: weird-shape 16s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add DNA Helix helper ---
const WeirdDNA = () => {
  const strands = useMemo(() =>
    [...Array(20)].map((_, i) => ({
      left: 50 + Math.sin(i * 0.3) * 8,
      top: i * 4,
      delay: i * 0.2,
      size: 8 + Math.random() * 4
    })), []
  );
  return (
    <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 pointer-events-none">
      {strands.map((strand, i) => (
        <div
          key={i}
          className="absolute animate-weird-dna"
          style={{
            left: `${strand.left}%`,
            top: `${strand.top}%`,
            width: `${strand.size}px`,
            height: `${strand.size}px`,
            animationDelay: `${strand.delay}s`,
            zIndex: 9
          }}
        >
          <div className="w-full h-full bg-cyan-400 rounded-full opacity-60" />
        </div>
      ))}
      <style>{`
        @keyframes weird-dna {
          0%, 100% { transform: translateX(0) scale(1); opacity: 0.6; }
          50% { transform: translateX(8px) scale(1.2); opacity: 0.9; }
        }
        .animate-weird-dna {
          animation: weird-dna 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// --- Add Glowing Orbs helper ---
const WeirdOrbs = () => {
  const orbs = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: ["#fbbf24","#f87171","#60a5fa","#a78bfa","#34d399"][i % 5],
      delay: Math.random() * 8,
      size: 16 + Math.random() * 24,
      trail: Math.random() > 0.5
    })), []
  );
  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute animate-weird-orb pointer-events-none"
          style={{
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            animationDelay: `${orb.delay}s`,
            zIndex: 7
          }}
        >
          <div className="w-full h-full rounded-full opacity-70 blur-sm" style={{background: orb.color}} />
          {orb.trail && (
            <div className="absolute w-full h-full rounded-full opacity-30 blur-md animate-weird-trail" style={{background: orb.color}} />
          )}
        </div>
      ))}
      <style>{`
        @keyframes weird-orb {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        .animate-weird-orb {
          animation: weird-orb 12s ease-in-out infinite;
        }
        @keyframes weird-trail {
          0% { transform: scale(1.5); opacity: 0.3; }
          100% { transform: scale(0.5); opacity: 0; }
        }
        .animate-weird-trail {
          animation: weird-trail 4s linear infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Glitch Effect helper ---
const WeirdGlitch = () => (
  <div className="absolute inset-0 z-20 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-weird-glitch" />
    <style>{`
      @keyframes weird-glitch {
        0%, 100% { opacity: 0; transform: translateX(0); }
        10% { opacity: 0.1; transform: translateX(-2px); }
        20% { opacity: 0; transform: translateX(2px); }
        30% { opacity: 0.05; transform: translateX(-1px); }
        40% { opacity: 0; transform: translateX(1px); }
        50% { opacity: 0.08; transform: translateX(-3px); }
        60% { opacity: 0; transform: translateX(3px); }
        70% { opacity: 0.03; transform: translateX(-1px); }
        80% { opacity: 0; transform: translateX(1px); }
        90% { opacity: 0.06; transform: translateX(-2px); }
      }
      .animate-weird-glitch {
        animation: weird-glitch 8s linear infinite;
      }
    `}</style>
  </div>
);

// --- Enhanced WeirdBG ---
const WeirdBG = () => {
  const emojis = useMemo(() => [
    "👽", "🦑", "🦋", "🌀", "🧠", "👾", "🔺", "🔮", "💫", "🦷", "🛸", "🧬", "🔮", "⚡", "🌌", "🎭", "🎪", "🎨", "🎯", "🎲"
  ].map((emoji, i) => ({
    emoji,
    left: Math.random() * 90,
    top: Math.random() * 80,
    delay: i * 0.5 + Math.random() * 0.3,
    spin: Math.random() > 0.5,
    pulse: Math.random() > 0.5
  })), []);
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Psychedelic animated gradient */}
      <div className="absolute inset-0 w-full h-full animate-weird-gradient bg-gradient-to-br from-lime-400 via-fuchsia-500 to-cyan-400 opacity-70" />
      {/* Morphing blobs */}
      <div className="absolute w-72 h-72 bg-purple-400 opacity-30 blur-3xl rounded-full animate-blob left-1/4 top-1/3" />
      <div className="absolute w-60 h-60 bg-green-400 opacity-30 blur-3xl rounded-full animate-blob animation-delay-2000 left-2/3 top-1/4" />
      <div className="absolute w-52 h-52 bg-pink-400 opacity-20 blur-2xl rounded-full animate-blob animation-delay-1000 left-1/2 top-2/3" />
      {/* DNA Helix */}
      <WeirdDNA />
      {/* Glowing Orbs */}
      <WeirdOrbs />
      {/* Geometric Shapes */}
      <WeirdShapes />
      {/* Glitch Effect */}
      <WeirdGlitch />
      {/* Weird emojis and shapes */}
      {emojis.map(({ emoji, left, top, delay, spin, pulse }, i) => (
        <div
          key={i}
          className={`absolute text-3xl animate-weird-float${spin ? ' animate-weird-spin' : ''}${pulse ? ' animate-weird-pulse' : ''}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            zIndex: 10
          }}
        >
          {emoji}
        </div>
      ))}
      <style>{`
        @keyframes weird-gradient {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(90deg) brightness(1.03); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        .animate-weird-gradient {
          animation: weird-gradient 22s ease-in-out infinite;
        }
        @keyframes blob {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.15) translateY(-16px); }
        }
        .animate-blob {
          animation: blob 18s ease-in-out infinite;
        }
        @keyframes weird-float {
          0%, 100% { transform: translateY(0) rotate(-3deg) scale(1); }
          20% { transform: translateY(-4px) rotate(3deg) scale(1.02); }
          40% { transform: translateY(3px) rotate(-2deg) scale(1.01); }
          60% { transform: translateY(-3px) rotate(2deg) scale(1.02); }
          80% { transform: translateY(4px) rotate(-1deg) scale(1.01); }
        }
        .animate-weird-float {
          animation: weird-float 12s infinite;
        }
        @keyframes weird-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-weird-spin {
          animation: weird-spin 8s linear infinite;
        }
        @keyframes weird-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .animate-weird-pulse {
          animation: weird-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// --- Add Vortex Pattern helper ---
const ConfusingVortex = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-5 pointer-events-none">
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
      <defs>
        <radialGradient id="vortex-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#vortex-glow)" />
      {[...Array(8)].map((_, i) => (
        <path
          key={i}
          d={`M200,200 Q${200 + Math.cos(i * 0.785) * 150},${200 + Math.sin(i * 0.785) * 150} ${200 + Math.cos(i * 0.785) * 80},${200 + Math.sin(i * 0.785) * 80}`}
          stroke="#60a5fa"
          strokeWidth="2"
          fill="none"
          opacity="0.3"
          className="animate-confusing-vortex"
          style={{ animationDelay: `${i * 0.5}s` }}
        />
      ))}
    </svg>
      <style>{`
      @keyframes confusing-vortex {
        0% { transform: rotate(0deg) scale(1); opacity: 0.3; }
        50% { transform: rotate(180deg) scale(1.2); opacity: 0.6; }
        100% { transform: rotate(360deg) scale(1); opacity: 0.3; }
      }
      .animate-confusing-vortex {
        animation: confusing-vortex 20s linear infinite;
        }
      `}</style>
    </div>
  );

// --- Add Glitchy Text helper ---
const ConfusingText = () => {
  const fragments = useMemo(() => [
    "WHAT?", "HUH?", "???", "WHY?", "HOW?", "WHEN?", "WHERE?", "WHO?"
  ].map((text, i) => ({
    text,
      left: Math.random() * 100,
      top: Math.random() * 100,
    delay: Math.random() * 8,
    size: 14 + Math.random() * 12,
    color: ["#f87171","#fbbf24","#60a5fa","#a78bfa","#34d399"][i % 5]
  })), []);
  return (
    <>
      {fragments.map((frag, i) => (
        <div
          key={i}
          className="absolute font-bold animate-confusing-text pointer-events-none"
          style={{
            left: `${frag.left}%`,
            top: `${frag.top}%`,
            fontSize: `${frag.size}px`,
            color: frag.color,
            animationDelay: `${frag.delay}s`,
            zIndex: 8
          }}
        >
          {frag.text}
        </div>
      ))}
      <style>{`
        @keyframes confusing-text {
          0%, 100% { opacity: 0.7; transform: translateX(0) scale(1); }
          25% { opacity: 0.3; transform: translateX(-2px) scale(0.9); }
          50% { opacity: 1; transform: translateX(2px) scale(1.1); }
          75% { opacity: 0.5; transform: translateX(-1px) scale(0.95); }
        }
        .animate-confusing-text {
          animation: confusing-text 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Puzzle Pieces helper ---
const ConfusingPuzzles = () => {
  const pieces = useMemo(() =>
    [...Array(6)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: ["#f87171","#fbbf24","#60a5fa","#a78bfa","#34d399"][i % 5],
      delay: Math.random() * 8,
      size: 24 + Math.random() * 20,
      rotate: Math.random() * 360
    })), []
  );
  return (
    <>
      {pieces.map((piece, i) => (
        <div
          key={i}
          className="absolute animate-confusing-puzzle pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: `${piece.top}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            zIndex: 9
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M0 8 Q8 8 8 0 Q8 8 16 8 Q8 8 8 16 Q8 8 0 8" fill={piece.color} fillOpacity="0.6" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes confusing-puzzle {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.6; }
          25% { transform: rotate(90deg) scale(1.1); opacity: 0.8; }
          50% { transform: rotate(180deg) scale(0.9); opacity: 0.4; }
          75% { transform: rotate(270deg) scale(1.05); opacity: 0.7; }
        }
        .animate-confusing-puzzle {
          animation: confusing-puzzle 12s linear infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Brain Icons helper ---
const ConfusingBrains = () => {
  const brains = useMemo(() =>
    [...Array(4)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      size: 28 + Math.random() * 16
    })), []
  );
  return (
    <>
      {brains.map((brain, i) => (
        <div
          key={i}
          className="absolute animate-confusing-brain pointer-events-none"
          style={{
            left: `${brain.left}%`,
            top: `${brain.top}%`,
            fontSize: `${brain.size}px`,
            animationDelay: `${brain.delay}s`,
            zIndex: 10
          }}
        >
          🧠
        </div>
      ))}
      <style>{`
        @keyframes confusing-brain {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
          25% { transform: scale(1.2) rotate(90deg); opacity: 0.9; }
          50% { transform: scale(0.8) rotate(180deg); opacity: 0.5; }
          75% { transform: scale(1.1) rotate(270deg); opacity: 0.8; }
        }
        .animate-confusing-brain {
          animation: confusing-brain 10s linear infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Distortion Effect helper ---
const ConfusingDistortion = () => (
  <div className="absolute inset-0 z-15 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-0 animate-confusing-distortion" />
    <style>{`
      @keyframes confusing-distortion {
        0%, 100% { opacity: 0; transform: skewX(0deg); }
        10% { opacity: 0.1; transform: skewX(-2deg); }
        20% { opacity: 0; transform: skewX(2deg); }
        30% { opacity: 0.05; transform: skewX(-1deg); }
        40% { opacity: 0; transform: skewX(1deg); }
        50% { opacity: 0.08; transform: skewX(-3deg); }
        60% { opacity: 0; transform: skewX(3deg); }
        70% { opacity: 0.03; transform: skewX(-1deg); }
        80% { opacity: 0; transform: skewX(1deg); }
        90% { opacity: 0.06; transform: skewX(-2deg); }
      }
      .animate-confusing-distortion {
        animation: confusing-distortion 12s linear infinite;
        }
      `}</style>
    </div>
  );

// --- Enhanced ConfusingBG ---
const ConfusingBG = () => {
  const marks = useMemo(() =>
    [...Array(40)].map((_, i) => ({
      left: Math.random() * 95,
      top: Math.random() * 90,
      size: 28 + Math.random() * 64,
      color: [
        'text-red-400', 'text-orange-400', 'text-yellow-400',
        'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-amber-400'
      ][Math.floor(Math.random() * 7)],
      delay: Math.random() * 2,
      rotate: -180 + Math.random() * 360,
      blur: Math.random() > 0.7 ? 2 : 0,
      upsideDown: Math.random() > 0.5,
      spin: Math.random() > 0.5,
      fade: Math.random() > 0.5
    })), []);
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Chaotic animated gradient */}
      <div className="absolute inset-0 w-full h-full animate-confusing-gradient bg-gradient-to-br from-cyan-200 via-fuchsia-100 to-yellow-100 opacity-70" />
      {/* Vortex Pattern */}
      <ConfusingVortex />
      {/* Glitchy Text */}
      <ConfusingText />
      {/* Puzzle Pieces */}
      <ConfusingPuzzles />
      {/* Brain Icons */}
      <ConfusingBrains />
      {/* Distortion Effect */}
      <ConfusingDistortion />
      {/* Floating question marks */}
      {marks.map((m, i) => (
        <div
          key={i}
          className={`absolute select-none ${m.color} animate-confusing-float${m.spin ? ' animate-confusing-spin' : ''}${m.fade ? ' animate-confusing-fade' : ''}`}
          style={{
            left: `${m.left + (Math.random() - 0.5) * 8}%`,
            top: `${m.top + (Math.random() - 0.5) * 8}%`,
            fontSize: `${m.size}px`,
            opacity: 0.4 + Math.random() * 0.6,
            animationDelay: `${m.delay}s`,
            filter: m.blur ? `blur(${m.blur}px)` : undefined,
            transform: `rotate(${m.rotate}deg) scaleY(${m.upsideDown ? -1 : 1}) scale(${0.7 + Math.random() * 1.2})`,
            zIndex: 11
          }}
        >
          ?
        </div>
      ))}
      {/* Swirling lines */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 border-dashed border-indigo-300 opacity-30 animate-confusing-swirl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${60 + Math.random() * 80}px`,
            height: `${60 + Math.random() * 80}px`,
            animationDelay: `${Math.random() * 8}s`,
            zIndex: 6
          }}
        />
      ))}
      <style>{`
        @keyframes confusing-gradient {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(60deg) brightness(1.03); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        .animate-confusing-gradient {
          animation: confusing-gradient 22s ease-in-out infinite;
        }
        @keyframes confusing-float {
          0%, 100% { transform: translateY(0) scale(1); }
          20% { transform: translateY(-4px) scale(1.01) rotate(-2deg); }
          40% { transform: translateY(3px) scale(0.99) rotate(2deg); }
          60% { transform: translateY(-3px) scale(1.01) rotate(-2deg); }
          80% { transform: translateY(4px) scale(1.01) rotate(2deg); }
        }
        .animate-confusing-float {
          animation: confusing-float 10s infinite;
        }
        @keyframes confusing-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-confusing-spin {
          animation: confusing-spin 8s linear infinite;
        }
        @keyframes confusing-fade {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        .animate-confusing-fade {
          animation: confusing-fade 10s ease-in-out infinite;
        }
        @keyframes confusing-swirl {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
        }
        .animate-confusing-swirl {
          animation: confusing-swirl 18s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- Add Sacred Geometry helper ---
const SpiritualGeometry = () => {
  const shapes = useMemo(() =>
    [...Array(6)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      type: ['flower', 'mandala', 'star'][i % 3],
      color: ["#fbbf24","#f87171","#60a5fa","#a78bfa","#34d399","#f59e0b"][i % 6],
      delay: Math.random() * 8,
      size: 40 + Math.random() * 60,
      rotate: Math.random() * 360
    })), []
  );
  return (
    <>
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute animate-spiritual-geometry pointer-events-none"
          style={{
            left: `${shape.left}%`,
            top: `${shape.top}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDelay: `${shape.delay}s`,
            zIndex: 8
          }}
        >
          {shape.type === 'flower' && (
            <svg viewBox="0 0 40 40" fill="none">
              {[...Array(8)].map((_, j) => (
                <ellipse
                  key={j}
                  cx="20"
                  cy="20"
                  rx="8"
                  ry="3"
                  fill={shape.color}
                  fillOpacity="0.4"
                  transform={`rotate(${j * 45} 20 20)`}
                />
              ))}
              <circle cx="20" cy="20" r="4" fill={shape.color} fillOpacity="0.6" />
          </svg>
          )}
          {shape.type === 'mandala' && (
            <svg viewBox="0 0 40 40" fill="none">
              {[...Array(12)].map((_, j) => (
                <path
                  key={j}
                  d="M20 20 L20 8 A12 12 0 0 1 20 8 Z"
                  fill={shape.color}
                  fillOpacity="0.3"
                  transform={`rotate(${j * 30} 20 20)`}
                />
              ))}
              <circle cx="20" cy="20" r="6" fill={shape.color} fillOpacity="0.5" />
            </svg>
          )}
          {shape.type === 'star' && (
            <svg viewBox="0 0 40 40" fill="none">
              <polygon
                points="20,2 24,14 36,14 28,22 32,34 20,26 8,34 12,22 4,14 16,14"
                fill={shape.color}
                fillOpacity="0.4"
              />
            </svg>
          )}
        </div>
      ))}
      <style>{`
        @keyframes spiritual-geometry {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
          50% { transform: scale(1.1) rotate(180deg); opacity: 0.7; }
        }
        .animate-spiritual-geometry {
          animation: spiritual-geometry 20s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Light Orbs helper ---
const SpiritualOrbs = () => {
  const orbs = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: ["#fbbf24","#f87171","#60a5fa","#a78bfa","#34d399","#f59e0b"][i % 6],
      delay: Math.random() * 8,
      size: 12 + Math.random() * 20,
      pulse: Math.random() > 0.5
    })), []
  );
  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-spiritual-orb${orb.pulse ? ' animate-spiritual-pulse' : ''} pointer-events-none`}
          style={{
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: orb.color,
            animationDelay: `${orb.delay}s`,
            zIndex: 9
          }}
        >
          <div className="w-full h-full rounded-full blur-sm opacity-60" style={{background: orb.color}} />
    </div>
      ))}
      <style>{`
        @keyframes spiritual-orb {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }
        .animate-spiritual-orb {
          animation: spiritual-orb 8s ease-in-out infinite;
        }
        @keyframes spiritual-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-spiritual-pulse {
          animation: spiritual-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Angelic Symbols helper ---
const SpiritualSymbols = () => {
  const symbols = useMemo(() => [
    "✨", "🌟", "💫", "⭐", "☀️", "🌙", "🕊️", "🌸", "🌺", "🌼", "🌻", "🌷"
  ].map((symbol, i) => ({
    symbol,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 8,
    size: 20 + Math.random() * 16,
    float: Math.random() > 0.5
  })), []);
  return (
    <>
      {symbols.map((sym, i) => (
        <div
          key={i}
          className={`absolute animate-spiritual-symbol${sym.float ? ' animate-spiritual-float' : ''} pointer-events-none`}
          style={{
            left: `${sym.left}%`,
            top: `${sym.top}%`,
            fontSize: `${sym.size}px`,
            animationDelay: `${sym.delay}s`,
            zIndex: 10
          }}
        >
          {sym.symbol}
        </div>
      ))}
      <style>{`
        @keyframes spiritual-symbol {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-spiritual-symbol {
          animation: spiritual-symbol 10s ease-in-out infinite;
        }
        @keyframes spiritual-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-spiritual-float {
          animation: spiritual-float 12s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Chakra Colors helper ---
const SpiritualChakras = () => {
  const chakras = useMemo(() => [
    { color: "#f87171", name: "root" },
    { color: "#fbbf24", name: "sacral" },
    { color: "#34d399", name: "solar" },
    { color: "#60a5fa", name: "heart" },
    { color: "#a78bfa", name: "throat" },
    { color: "#f59e0b", name: "third-eye" },
    { color: "#fbbf24", name: "crown" }
  ].map((chakra, i) => ({
    ...chakra,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 8,
    size: 30 + Math.random() * 20
  })), []);
  return (
    <>
      {chakras.map((chakra, i) => (
        <div
          key={i}
          className="absolute animate-spiritual-chakra pointer-events-none"
          style={{
            left: `${chakra.left}%`,
            top: `${chakra.top}%`,
            width: `${chakra.size}px`,
            height: `${chakra.size}px`,
            animationDelay: `${chakra.delay}s`,
            zIndex: 7
          }}
        >
          <div className="w-full h-full rounded-full opacity-40 blur-md" style={{background: chakra.color}} />
          <div className="absolute inset-0 rounded-full border-2 border-white opacity-30" />
        </div>
      ))}
      <style>{`
        @keyframes spiritual-chakra {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .animate-spiritual-chakra {
          animation: spiritual-chakra 15s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Ethereal Mist helper ---
const SpiritualMist = () => (
  <div className="absolute inset-0 z-5 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20 animate-spiritual-mist" />
    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-15 animate-spiritual-mist2" />
    <style>{`
      @keyframes spiritual-mist {
        0%, 100% { opacity: 0.2; transform: translateY(0); }
        50% { opacity: 0.4; transform: translateY(-20px); }
      }
      .animate-spiritual-mist {
        animation: spiritual-mist 25s ease-in-out infinite;
      }
      @keyframes spiritual-mist2 {
        0%, 100% { opacity: 0.15; transform: translateY(0); }
        50% { opacity: 0.3; transform: translateY(20px); }
      }
      .animate-spiritual-mist2 {
        animation: spiritual-mist2 30s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// --- Add Divine Light Ray helper ---
const DivineLightRay = () => (
  <div className="absolute left-1/2 top-0 -translate-x-1/2 z-20 pointer-events-none w-full flex justify-center">
    <svg width="420" height="420" viewBox="0 0 420 420" fill="none" className="block">
      <defs>
        <radialGradient id="divine-glow" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="divine-ray" x1="210" y1="0" x2="210" y2="420" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.13" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Main ray */}
      <rect x="110" y="0" width="200" height="420" fill="url(#divine-ray)" opacity="0.7" className="animate-divine-ray" />
      {/* Glow */}
      <ellipse cx="210" cy="320" rx="120" ry="60" fill="url(#divine-glow)" />
    </svg>
    <style>{`
      @keyframes divine-ray {
        0%, 100% { opacity: 0.7; filter: blur(0px); }
        50% { opacity: 1; filter: blur(2px); }
      }
      .animate-divine-ray {
        animation: divine-ray 7s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// --- Enhanced SpiritualBG ---
const SpiritualBG = () => {
  const sparkles = useMemo(() =>
    [...Array(50)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6
    })), []
  );
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep spiritual blue-violet gradient background */}
      <div className="absolute inset-0 w-full h-full animate-spiritual-gradient bg-gradient-to-br from-indigo-900 via-blue-800 via-purple-700 to-fuchsia-400 opacity-95" />
      {/* Divine light ray */}
      <DivineLightRay />
      {/* Sacred Geometry */}
      <SpiritualGeometry />
      {/* Light Orbs */}
      <SpiritualOrbs />
      {/* Angelic Symbols */}
      <SpiritualSymbols />
      {/* Chakra Colors */}
      <SpiritualChakras />
      {/* Ethereal Mist */}
      <SpiritualMist />
      {/* Sparkles */}
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-spiritual-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            zIndex: 6
          }}
        />
      ))}
      {/* Floating feathers */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white opacity-30 animate-spiritual-feather"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 16}px`,
            animationDelay: `${Math.random() * 8}s`,
            zIndex: 11
          }}
        >
          ✨
        </div>
      ))}
      <style>{`
        @keyframes spiritual-gradient {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(15deg) brightness(1.02); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        .animate-spiritual-gradient {
          animation: spiritual-gradient 30s ease-in-out infinite;
        }
        @keyframes spiritual-sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-spiritual-sparkle {
          animation: spiritual-sparkle ease-in-out infinite;
        }
        @keyframes spiritual-feather {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        .animate-spiritual-feather {
          animation: spiritual-feather 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// --- Add Birds helper ---
const PeacefulBirds = () => {
  const birds = useMemo(() =>
    [...Array(7)].map((_, i) => ({
      left: -10 - Math.random() * 20,
      top: 10 + Math.random() * 30 + i * 4,
      duration: 18 + Math.random() * 8,
      delay: Math.random() * 10,
      size: 24 + Math.random() * 18,
      flip: Math.random() > 0.5
    })), []
  );
  return (
    <>
      {birds.map((bird, i) => (
        <div
          key={i}
          className="absolute animate-peaceful-bird pointer-events-none"
          style={{
            left: `${bird.left}%`,
            top: `${bird.top}%`,
            width: `${bird.size}px`,
            height: `${bird.size}px`,
            animationDuration: `${bird.duration}s`,
            animationDelay: `${bird.delay}s`,
            zIndex: 8
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M2 12 Q8 8 12 12 Q16 8 22 12" stroke="#8b5cf6" strokeWidth="2" fill="none" />
            <circle cx="8" cy="10" r="1" fill="#8b5cf6" />
            <circle cx="16" cy="10" r="1" fill="#8b5cf6" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes peaceful-bird {
          0% { transform: translateX(0) scale(1); opacity: 0.8; }
          50% { transform: translateX(120vw) scale(1.1); opacity: 1; }
          100% { transform: translateX(140vw) scale(1); opacity: 0.6; }
        }
        .animate-peaceful-bird {
          animation: peaceful-bird linear infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Sun Rays helper ---
const PeacefulSunRays = () => (
  <div className="absolute left-1/2 top-[15%] -translate-x-1/2 z-10 pointer-events-none">
    <div className="relative flex items-center justify-center">
      <div className="w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-60 animate-peaceful-sun-glow" />
      <div className="absolute w-24 h-24 bg-yellow-200 rounded-full blur-3xl opacity-80 animate-peaceful-sun-glow2" />
      {/* Sun rays */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 w-1 h-16 bg-yellow-200 opacity-40 rounded-full"
          style={{
            transform: `rotate(${i * 30}deg) translateY(-40px)`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
    <style>{`
      @keyframes peaceful-sun-glow {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      .animate-peaceful-sun-glow {
        animation: peaceful-sun-glow 8s ease-in-out infinite;
      }
      @keyframes peaceful-sun-glow2 {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      .animate-peaceful-sun-glow2 {
        animation: peaceful-sun-glow2 12s ease-in-out infinite;
      }
    `}</style>
  </div>
);

// --- Add Peaceful Clouds helper ---
const PeacefulClouds = () => {
  const clouds = useMemo(() =>
    [...Array(7)].map((_, i) => ({
      left: Math.random() * 100,
      top: 10 + Math.random() * 40,
      size: 120 + Math.random() * 80,
      opacity: 0.18 + Math.random() * 0.18,
      duration: 38 + Math.random() * 18,
      delay: Math.random() * 12,
      blur: 8 + Math.random() * 12
    })), []
  );
  return (
    <>
      {clouds.map((cloud, i) => (
        <div
          key={i}
          className="absolute animate-peaceful-cloud pointer-events-none"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.55}px`,
            opacity: cloud.opacity,
            filter: `blur(${cloud.blur}px)`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
            zIndex: 3
          }}
        >
          <svg viewBox="0 0 120 66" width="100%" height="100%" fill="none">
            <ellipse cx="40" cy="33" rx="40" ry="33" fill="#fff" fillOpacity="0.7" />
            <ellipse cx="80" cy="38" rx="32" ry="26" fill="#fff" fillOpacity="0.5" />
            <ellipse cx="60" cy="50" rx="24" ry="16" fill="#fff" fillOpacity="0.4" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes peaceful-cloud {
          0% { transform: translateX(0); }
          100% { transform: translateX(120vw); }
        }
        .animate-peaceful-cloud {
          animation: peaceful-cloud linear infinite;
        }
      `}</style>
    </>
  );
};

// --- Enhanced PeacefulBG ---
const PeacefulBG = () => {
  const sparkles = useMemo(() =>
    [...Array(60)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 6
    })), []
  );
  const feathers = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      size: 16 + Math.random() * 12
    })), []
  );
  return (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Peaceful blue gradient background */}
      <div className="absolute inset-0 w-full h-full animate-peaceful-gradient bg-gradient-to-br from-blue-200 via-blue-400 to-indigo-700 opacity-95" />
      {/* Animated clouds */}
      <PeacefulClouds />
      {/* Birds */}
      <PeacefulBirds />
      {/* Sparkles */}
      {sparkles.map((sparkle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-peaceful-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            zIndex: 6
          }}
        />
      ))}
      {/* Feathers */}
      {feathers.map((feather, i) => (
        <div
          key={i}
          className="absolute text-white opacity-40 animate-peaceful-feather"
          style={{
            left: `${feather.left}%`,
            top: `${feather.top}%`,
            fontSize: `${feather.size}px`,
            animationDelay: `${feather.delay}s`,
            zIndex: 7
          }}
        >
          ✨
        </div>
      ))}
      {/* Water reflection shimmer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-200/30 to-transparent animate-peaceful-shimmer" />
    <style>{`
      @keyframes peaceful-gradient {
        0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(10deg) brightness(1.02); }
        100% { filter: hue-rotate(0deg) brightness(1); }
      }
      .animate-peaceful-gradient {
          animation: peaceful-gradient 25s ease-in-out infinite;
        }
        @keyframes peaceful-sparkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-peaceful-sparkle {
          animation: peaceful-sparkle ease-in-out infinite;
        }
        @keyframes peaceful-feather {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.7; }
        }
        .animate-peaceful-feather {
          animation: peaceful-feather 15s ease-in-out infinite;
        }
        @keyframes peaceful-shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-peaceful-shimmer {
          animation: peaceful-shimmer 8s ease-in-out infinite;
      }
    `}</style>
  </div>
);
};

// --- Add Fog helper ---
const ScaryFog = () => {
  const fogLayers = useMemo(() => [
    { blur: 24, opacity: 0.18, duration: 38, delay: 0, color: 'rgba(180,180,200,0.18)' },
    { blur: 36, opacity: 0.13, duration: 54, delay: 8, color: 'rgba(120,120,160,0.13)' },
    { blur: 18, opacity: 0.11, duration: 44, delay: 16, color: 'rgba(220,220,255,0.11)' },
  ], []);
  return (
    <>
      {fogLayers.map((fog, i) => (
        <div
          key={i}
          className="absolute left-[-10%] w-[120vw] h-[60vh] top-[10%] animate-scary-fog pointer-events-none"
          style={{
            filter: `blur(${fog.blur}px)`,
            opacity: fog.opacity,
            background: fog.color,
            animationDuration: `${fog.duration}s`,
            animationDelay: `${fog.delay}s`,
            zIndex: 5
          }}
        />
      ))}
      <style>{`
        @keyframes scary-fog {
          0%, 100% { transform: translateX(-10%) scale(1); opacity: 0.1; }
          50% { transform: translateX(10%) scale(1.1); opacity: 0.2; }
        }
        .animate-scary-fog {
          animation: scary-fog ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Eyes helper ---
const ScaryEyes = () => {
  const eyes = useMemo(() =>
    [...Array(12)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: ["#ef4444","#dc2626","#991b1b","#7f1d1d"][i % 4],
      delay: Math.random() * 8,
      size: 8 + Math.random() * 12,
      flicker: Math.random() > 0.5
    })), []
  );
  return (
    <>
      {eyes.map((eye, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-scary-eye${eye.flicker ? ' animate-scary-flicker' : ''} pointer-events-none`}
          style={{
            left: `${eye.left}%`,
            top: `${eye.top}%`,
            width: `${eye.size}px`,
            height: `${eye.size}px`,
            background: eye.color,
            animationDelay: `${eye.delay}s`,
            zIndex: 9
          }}
        >
          <div className="w-full h-full rounded-full blur-sm opacity-80" style={{background: eye.color}} />
        </div>
      ))}
      <style>{`
        @keyframes scary-eye {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .animate-scary-eye {
          animation: scary-eye 6s ease-in-out infinite;
        }
        @keyframes scary-flicker {
          0%, 100% { opacity: 0.8; }
          25% { opacity: 0.3; }
          50% { opacity: 1; }
          75% { opacity: 0.5; }
        }
        .animate-scary-flicker {
          animation: scary-flicker 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Lightning helper ---
const ScaryLightning = () => (
  <div className="absolute inset-0 z-20 pointer-events-none">
    <div className="absolute inset-0 bg-white opacity-0 animate-scary-lightning" />
    <style>{`
      @keyframes scary-lightning {
        0%, 100% { opacity: 0; }
        5% { opacity: 0.8; }
        10% { opacity: 0; }
        15% { opacity: 0.6; }
        20% { opacity: 0; }
        25% { opacity: 0.4; }
        30% { opacity: 0; }
      }
      .animate-scary-lightning {
        animation: scary-lightning 12s linear infinite;
      }
    `}</style>
  </div>
);

// --- Add Cobwebs helper ---
const ScaryCobwebs = () => {
  const cobwebs = useMemo(() =>
    [...Array(4)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      size: 40 + Math.random() * 30
    })), []
  );
  return (
    <>
      {cobwebs.map((web, i) => (
        <div
          key={i}
          className="absolute animate-scary-cobweb pointer-events-none"
          style={{
            left: `${web.left}%`,
            top: `${web.top}%`,
            width: `${web.size}px`,
            height: `${web.size}px`,
            animationDelay: `${web.delay}s`,
            zIndex: 8
          }}
        >
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="15" stroke="#9ca3af" strokeWidth="1" fill="none" />
            <line x1="20" y1="5" x2="20" y2="35" stroke="#9ca3af" strokeWidth="1" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="#9ca3af" strokeWidth="1" />
            <line x1="8" y1="8" x2="32" y2="32" stroke="#9ca3af" strokeWidth="1" />
            <line x1="32" y1="8" x2="8" y2="32" stroke="#9ca3af" strokeWidth="1" />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes scary-cobweb {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-scary-cobweb {
          animation: scary-cobweb 15s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Enhanced ScaryBG ---
const ScaryBG = () => {
  const emojis = useMemo(() => [
    "👻", "💀", "🦇", "🕷️", "🕸️", "🎃", "⚰️", "🩸", "🔮", "🕯️", "🌙", "⚡", "🌪️", "🔥", "💀", "👹", "👺", "🤡", "😱", "😨"
  ].map((emoji, i) => ({
    emoji,
    left: Math.random() * 90,
    top: Math.random() * 80,
    delay: i * 0.4 + Math.random() * 0.3,
    pulse: Math.random() > 0.5
  })), []);
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Deep red/black gradient background */}
      <div className="absolute inset-0 w-full h-full animate-scary-gradient bg-gradient-to-b from-red-900 via-red-800 to-black opacity-95" />
      {/* Fog */}
      <ScaryFog />
      {/* Eyes */}
      <ScaryEyes />
      {/* Cobwebs */}
      <ScaryCobwebs />
      {/* Spooky emojis */}
      {emojis.map(({ emoji, left, top, delay, pulse }, i) => (
        <div
          key={i}
          className={`absolute text-3xl animate-scary-float${pulse ? ' animate-scary-pulse' : ''}`}
          style={{
            left: `${left}%`,
            top: `${top}%`,
            animationDelay: `${delay}s`,
            zIndex: 10
          }}
        >
          {emoji}
        </div>
      ))}
      <style>{`
        @keyframes scary-gradient {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(-10deg) brightness(0.95); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        .animate-scary-gradient {
          animation: scary-gradient 20s ease-in-out infinite;
        }
        @keyframes scary-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        .animate-scary-float {
          animation: scary-float 8s ease-in-out infinite;
        }
        @keyframes scary-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        .animate-scary-pulse {
          animation: scary-pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// --- Add Romantic Heart helper ---
const RomanticHeart = () => (
  <div className="absolute left-1/2 top-[18%] -translate-x-1/2 z-10 pointer-events-none">
    <div className="relative flex items-center justify-center">
      <div className="w-32 h-32 bg-pink-300 rounded-full blur-2xl opacity-60 animate-romantic-heart-glow" />
      <div className="absolute w-24 h-24 bg-pink-200 rounded-full blur-3xl opacity-80 animate-romantic-heart-glow2" />
      {/* Heart rays */}
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 w-1 h-12 bg-pink-100 opacity-30 rounded-full"
          style={{
            transform: `rotate(${i * 25.7}deg) translateY(-30px)`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
      <div className="text-6xl animate-romantic-heart-pulse">💖</div>
    </div>
    <style>{`
      @keyframes romantic-heart-glow {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      .animate-romantic-heart-glow {
        animation: romantic-heart-glow 8s ease-in-out infinite;
      }
      @keyframes romantic-heart-glow2 {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 1; }
      }
      .animate-romantic-heart-glow2 {
        animation: romantic-heart-glow2 12s ease-in-out infinite;
      }
      @keyframes romantic-heart-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .animate-romantic-heart-pulse {
        animation: romantic-heart-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );

// --- Add Rose Petals helper ---
const RomanticPetals = () => {
  const petals = useMemo(() =>
    [...Array(15)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 8,
      size: 16 + Math.random() * 12,
      color: ["#f87171","#ec4899","#be185d","#e11d48"][i % 4]
    })), []
  );
  return (
    <>
      {petals.map((petal, i) => (
        <div
          key={i}
          className="absolute animate-romantic-petal pointer-events-none"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            fontSize: `${petal.size}px`,
            color: petal.color,
            animationDelay: `${petal.delay}s`,
            zIndex: 8
          }}
        >
          🌹
        </div>
      ))}
      <style>{`
        @keyframes romantic-petal {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-romantic-petal {
          animation: romantic-petal 12s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

// --- Add Lovebirds helper ---
const RomanticLovebirds = () => {
  const birds = useMemo(() =>
    [...Array(3)].map((_, i) => ({
      left: -15 - Math.random() * 20,
      top: 20 + Math.random() * 40 + i * 8,
      duration: 20 + Math.random() * 10,
      delay: Math.random() * 8,
      size: 20 + Math.random() * 12
    })), []
  );
  return (
    <>
      {birds.map((bird, i) => (
        <div
          key={i}
          className="absolute animate-romantic-bird pointer-events-none"
          style={{
            left: `${bird.left}%`,
            top: `${bird.top}%`,
            width: `${bird.size}px`,
            height: `${bird.size}px`,
            animationDuration: `${bird.duration}s`,
            animationDelay: `${bird.delay}s`,
            zIndex: 9
          }}
        >
          <div className="text-2xl">🕊️</div>
        </div>
      ))}
      <style>{`
        @keyframes romantic-bird {
          0% { transform: translateX(0) scale(1); opacity: 0.8; }
          50% { transform: translateX(130vw) scale(1.1); opacity: 1; }
          100% { transform: translateX(150vw) scale(1); opacity: 0.6; }
        }
        .animate-romantic-bird {
          animation: romantic-bird linear infinite;
        }
      `}</style>
    </>
  );
};

// --- Enhanced RomanticBG ---
const RomanticBG = () => {
  const hearts = useMemo(() =>
    [...Array(25)].map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 16 + Math.random() * 24,
      delay: Math.random() * 8,
      color: ["#f87171","#ec4899","#be185d","#e11d48","#f472b6"][i % 5],
      spin: Math.random() > 0.5
    })), []
  );
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Romantic pinkish-purple gradient background */}
      <div className="absolute inset-0 w-full h-full animate-romantic-gradient bg-gradient-to-br from-pink-400 via-pink-600 via-fuchsia-500 to-purple-700 opacity-95" />
      {/* Central Heart */}
      <RomanticHeart />
      {/* Rose Petals */}
      <RomanticPetals />
      {/* Lovebirds */}
      <RomanticLovebirds />
      {/* Floating hearts */}
      {hearts.map((heart, i) => (
        <div
          key={i}
          className={`absolute animate-romantic-float${heart.spin ? ' animate-romantic-spin' : ''}`}
          style={{
            left: `${heart.left}%`,
            top: `${heart.top}%`,
            fontSize: `${heart.size}px`,
            color: heart.color,
            animationDelay: `${heart.delay}s`,
            zIndex: 7
          }}
        >
          💕
        </div>
      ))}
      {/* Bokeh lights */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-romantic-bokeh"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            background: `hsl(${300 + Math.random() * 60}, 70%, 80%)`,
            opacity: 0.6,
            animationDelay: `${Math.random() * 8}s`,
            zIndex: 6
          }}
        />
      ))}
      <style>{`
        @keyframes romantic-gradient {
          0% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(10deg) brightness(1.03); }
          100% { filter: hue-rotate(0deg) brightness(1); }
        }
        .animate-romantic-gradient {
          animation: romantic-gradient 20s ease-in-out infinite;
        }
        @keyframes romantic-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .animate-romantic-float {
          animation: romantic-float 8s ease-in-out infinite;
        }
        @keyframes romantic-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-romantic-spin {
          animation: romantic-spin 10s linear infinite;
        }
        @keyframes romantic-bokeh {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-romantic-bokeh {
          animation: romantic-bokeh 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const MoodBackgrounds = ({ mood }) => {
  switch (mood.toLowerCase()) {
    case "peaceful":
      return <PeacefulBG />;
    case "scary":
      return <ScaryBG />;
    case "romantic":
      return <RomanticBG />;
    case "funny":
      return <FunnyBG />;
    case "weird":
      return <WeirdBG />;
    case "confusing":
      return <ConfusingBG />;
    case "spiritual":
      return <SpiritualBG />;
    default:
      return null;
  }
};

export default MoodBackgrounds;
