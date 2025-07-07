import React, { useEffect, useState, useRef } from "react";
import { db } from "./firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function DreamJournal({ user, onSelectDream, onDeleteDream, onShareDream }) {
  const [dreams, setDreams] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [longPressDream, setLongPressDream] = useState(null);
  const [longPressActiveId, setLongPressActiveId] = useState(null);
  const longPressTimeout = useRef();
  const longPressMoved = useRef(false);

  useEffect(() => {
    if (!user?.uid) return;
    // Listen to the user's dreams collection in Firestore
    const dreamsRef = collection(db, "users", user.uid, "dreams");
    const q = query(dreamsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dreamsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDreams(dreamsData);
    });
    return () => unsubscribe();
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
    if (openMenuId === null) return;
    const handleClick = (e) => {
      // Only close if not clicking inside a dream-menu
      if (!e.target.closest('.dream-menu')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenuId]);

  // Long-press handlers
  const handleTouchStart = (dream, e) => {
    longPressMoved.current = false;
    setLongPressActiveId(dream.id);
    longPressTimeout.current = setTimeout(() => {
      setLongPressDream(dream);
      setLongPressActiveId(null);
    }, 600);
  };
  const handleTouchEnd = () => {
    clearTimeout(longPressTimeout.current);
    setLongPressActiveId(null);
  };
  const handleTouchMove = () => {
    longPressMoved.current = true;
    clearTimeout(longPressTimeout.current);
    setLongPressActiveId(null);
  };
  // Mouse events for desktop
  const handleMouseDown = (dream, e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch devices
    setLongPressActiveId(dream.id);
    longPressTimeout.current = setTimeout(() => {
      setLongPressDream(dream);
      setLongPressActiveId(null);
    }, 600);
  };
  const handleMouseUp = () => {
    clearTimeout(longPressTimeout.current);
    setLongPressActiveId(null);
  };
  const handleMouseLeave = () => {
    clearTimeout(longPressTimeout.current);
    setLongPressActiveId(null);
  };

  if (!user?.uid) {
    return <div className="p-6 text-white">Please log in to view your dream journal.</div>;
  }

  return (
    <div className="dream-journal w-full max-w-2xl mx-auto p-0">
      {dreams.length === 0 ? null : (
        <ul className="space-y-2">
          {dreams.map((dream) => (
            <li
              key={dream.id}
              className={`bg-white/20 hover:bg-white/30 cursor-pointer rounded-xl px-4 py-3 border border-white/20 text-white shadow flex flex-col transition relative overflow-visible ${longPressActiveId === dream.id ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
              onClick={e => {
                // Only open modal if not clicking the menu
                if (e.target.closest('.dream-menu')) return;
                if (longPressMoved.current) return; // don't open on accidental scroll
                onSelectDream && onSelectDream(dream);
              }}
              onTouchStart={e => handleTouchStart(dream, e)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onMouseDown={e => handleMouseDown(dream, e)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-base truncate" title={dream.text}>{dream.text}</div>
                <div className="dream-menu relative ml-2">
                  <button
                    className="text-white/70 hover:text-white px-2 py-1 rounded-full focus:outline-none"
                    onClick={e => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === dream.id ? null : dream.id);
                    }}
                  >
                    <span className="text-xl">⋯</span>
                  </button>
                  {openMenuId === dream.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-lg z-[999] text-black text-sm flex flex-col">
                      <button
                        className="px-4 py-2 hover:bg-gray-100 text-left rounded-t-xl"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onDeleteDream && onDeleteDream(dream);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="px-4 py-2 hover:bg-gray-100 text-left rounded-b-xl"
                        onClick={e => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onShareDream && onShareDream(dream);
                        }}
                      >
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-purple-200 mt-1">{dream.mood}</div>
            </li>
          ))}
        </ul>
      )}
      {/* Long-press glassy modal */}
      {longPressDream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setLongPressDream(null)}>
          <div
            className="bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center relative"
            onClick={e => e.stopPropagation()}
          >
            <span className="text-4xl mb-3">🌙</span>
            <h2 className="text-xl font-bold text-white mb-2 text-center">Dream Options</h2>
            <div className="w-full flex flex-col gap-3 mt-4">
              <button
                className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg shadow-xl transition"
                onClick={() => {
                  setLongPressDream(null);
                  onShareDream && onShareDream(longPressDream);
                }}
              >
                Share
              </button>
              <button
                className="w-full py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-700 hover:from-red-600 hover:to-pink-800 text-white font-bold text-lg shadow-xl transition"
                onClick={() => {
                  setLongPressDream(null);
                  onDeleteDream && onDeleteDream(longPressDream);
                }}
              >
                Delete
              </button>
              <button
                className="w-full py-2 rounded-xl bg-white/30 hover:bg-white/50 text-purple-700 font-bold transition shadow mt-2"
                onClick={() => setLongPressDream(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
