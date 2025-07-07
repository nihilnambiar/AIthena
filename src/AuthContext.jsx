// src/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("[AuthContext] Auth state changed:", firebaseUser);
      if (firebaseUser) {
        // Fetch Firestore user doc for extra fields
        let userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || "User",
          email: firebaseUser.email,
          photo: firebaseUser.photoURL || "",
        };
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            console.log("[AuthContext] User doc exists:", snap.data());
            userData = { ...userData, ...snap.data() };
            // Always set hasLoggedIn: true on login
            await setDoc(userRef, { hasLoggedIn: true }, { merge: true });
          } else {
            console.log("[AuthContext] User doc does not exist, creating...");
            await setDoc(userRef, {
              uid: userData.uid,
              name: userData.name,
              email: userData.email,
              photo: userData.photo,
              premium: false,
              hasLoggedIn: true,
            });
          }
        } catch (e) { console.error("[AuthContext] Firestore error:", e); }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
