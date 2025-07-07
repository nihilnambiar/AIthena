import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Grant premium access to a user
 * @param {string} userId - The user's UID
 * @param {string} plan - Plan type ('monthly', 'annual', 'lifetime')
 * @param {number} durationDays - Duration in days
 * @param {string} grantedBy - UID of the admin granting access
 * @returns {Promise<boolean>} - Success status
 */
export const grantPremiumAccess = async (userId, plan = 'monthly', durationDays = 30, grantedBy = 'admin') => {
  try {
    const userRef = doc(db, "users", userId);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    
    await updateDoc(userRef, {
      premium: true,
      premiumPlan: plan,
      premiumStartDate: new Date(),
      premiumEndDate: endDate,
      grantedBy: grantedBy,
      grantedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error granting premium access:", error);
    return false;
  }
};

/**
 * Revoke premium access from a user
 * @param {string} userId - The user's UID
 * @param {string} revokedBy - UID of the admin revoking access
 * @returns {Promise<boolean>} - Success status
 */
export const revokePremiumAccess = async (userId, revokedBy = 'admin') => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      premium: false,
      premiumPlan: null,
      premiumEndDate: new Date(),
      revokedBy: revokedBy,
      revokedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error revoking premium access:", error);
    return false;
  }
};

/**
 * Extend premium access for a user
 * @param {string} userId - The user's UID
 * @param {number} additionalDays - Additional days to extend
 * @param {string} extendedBy - UID of the admin extending access
 * @returns {Promise<boolean>} - Success status
 */
export const extendPremiumAccess = async (userId, additionalDays, extendedBy = 'admin') => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userSnap.data();
    const currentEndDate = userData.premiumEndDate?.toDate?.() || new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + additionalDays);
    
    await updateDoc(userRef, {
      premiumEndDate: newEndDate,
      extendedBy: extendedBy,
      extendedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error extending premium access:", error);
    return false;
  }
};

/**
 * Check if a user has active premium access
 * @param {string} userId - The user's UID
 * @returns {Promise<Object>} - Premium status object
 */
export const checkPremiumStatus = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { hasPremium: false, reason: "User not found" };
    }
    
    const userData = userSnap.data();
    
    if (!userData.premium) {
      return { hasPremium: false, reason: "No premium subscription" };
    }
    
    const endDate = userData.premiumEndDate?.toDate?.() || new Date(userData.premiumEndDate);
    const now = new Date();
    
    if (endDate < now) {
      return { hasPremium: false, reason: "Premium expired", expiredAt: endDate };
    }
    
    return {
      hasPremium: true,
      plan: userData.premiumPlan,
      startDate: userData.premiumStartDate,
      endDate: endDate,
      daysRemaining: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    };
  } catch (error) {
    console.error("Error checking premium status:", error);
    return { hasPremium: false, reason: "Error checking status" };
  }
};

/**
 * Grant lifetime premium access
 * @param {string} userId - The user's UID
 * @param {string} grantedBy - UID of the admin granting access
 * @returns {Promise<boolean>} - Success status
 */
export const grantLifetimePremium = async (userId, grantedBy = 'admin') => {
  try {
    const userRef = doc(db, "users", userId);
    const farFutureDate = new Date();
    farFutureDate.setFullYear(farFutureDate.getFullYear() + 100); // 100 years from now
    
    await updateDoc(userRef, {
      premium: true,
      premiumPlan: 'lifetime',
      premiumStartDate: new Date(),
      premiumEndDate: farFutureDate,
      grantedBy: grantedBy,
      grantedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error granting lifetime premium:", error);
    return false;
  }
};

/**
 * Grant premium access for specific duration presets
 * @param {string} userId - The user's UID
 * @param {string} preset - Preset duration ('trial', 'month', 'quarter', 'year')
 * @param {string} grantedBy - UID of the admin granting access
 * @returns {Promise<boolean>} - Success status
 */
export const grantPremiumPreset = async (userId, preset, grantedBy = 'admin') => {
  const presets = {
    trial: { plan: 'trial', days: 7 },
    month: { plan: 'monthly', days: 30 },
    quarter: { plan: 'quarterly', days: 90 },
    year: { plan: 'annual', days: 365 }
  };
  
  const selectedPreset = presets[preset];
  if (!selectedPreset) {
    throw new Error(`Invalid preset: ${preset}`);
  }
  
  return grantPremiumAccess(userId, selectedPreset.plan, selectedPreset.days, grantedBy);
};

/**
 * Get all premium users
 * @returns {Promise<Array>} - Array of premium users
 */
export const getPremiumUsers = async () => {
  try {
    const { collection, getDocs, query, where } = await import("firebase/firestore");
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("premium", "==", true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching premium users:", error);
    return [];
  }
};

/**
 * Get premium statistics
 * @returns {Promise<Object>} - Premium statistics
 */
export const getPremiumStats = async () => {
  try {
    const { collection, getDocs } = await import("firebase/firestore");
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs.map(doc => doc.data());
    
    const totalUsers = users.length;
    const premiumUsers = users.filter(user => user.premium).length;
    const conversionRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;
    
    const planBreakdown = users
      .filter(user => user.premium && user.premiumPlan)
      .reduce((acc, user) => {
        acc[user.premiumPlan] = (acc[user.premiumPlan] || 0) + 1;
        return acc;
      }, {});
    
    return {
      totalUsers,
      premiumUsers,
      conversionRate: Math.round(conversionRate * 100) / 100,
      planBreakdown
    };
  } catch (error) {
    console.error("Error fetching premium stats:", error);
    return {
      totalUsers: 0,
      premiumUsers: 0,
      conversionRate: 0,
      planBreakdown: {}
    };
  }
}; 