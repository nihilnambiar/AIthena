/**
 * Browser Console Script to Grant Premium Access
 * 
 * Run this in your browser console while logged into DreamDive
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Call the functions as needed
 */

// Import Firebase functions (assuming they're available globally)
const { doc, updateDoc, getDoc } = window.firebase?.firestore || {};

// Get the current user's UID (you'll need to replace this with the target user's UID)
function getCurrentUserUid() {
  // Try to get from localStorage or auth context
  const userData = localStorage.getItem('dreamUser');
  if (userData) {
    const user = JSON.parse(userData);
    return user.uid;
  }
  
  // If not found, prompt for UID
  return prompt('Enter the user UID to grant premium access:');
}

// Grant premium access to a user
async function grantPremium(userId, plan = 'monthly', durationDays = 30) {
  try {
    console.log(`🌙 Granting premium access to user: ${userId}`);
    console.log(`📋 Plan: ${plan}, Duration: ${durationDays} days`);
    
    const userRef = doc(db, "users", userId);
    
    // Check if user exists
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error(`❌ User ${userId} not found`);
      return false;
    }
    
    const userData = userSnap.data();
    console.log(`👤 Found user: ${userData.name || userData.email}`);
    
    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    
    // Update user document
    await updateDoc(userRef, {
      premium: true,
      premiumPlan: plan,
      premiumStartDate: new Date(),
      premiumEndDate: endDate,
      grantedBy: getCurrentUserUid() || 'browser-console',
      grantedAt: new Date()
    });
    
    console.log(`✅ Successfully granted premium access!`);
    console.log(`📅 Premium expires: ${endDate.toLocaleDateString()}`);
    console.log(`🎉 User can now access all premium features`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error granting premium access:', error);
    return false;
  }
}

// Revoke premium access from a user
async function revokePremium(userId) {
  try {
    console.log(`🚫 Revoking premium access from user: ${userId}`);
    
    const userRef = doc(db, "users", userId);
    
    // Check if user exists
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error(`❌ User ${userId} not found`);
      return false;
    }
    
    const userData = userSnap.data();
    console.log(`👤 Found user: ${userData.name || userData.email}`);
    
    // Update user document
    await updateDoc(userRef, {
      premium: false,
      premiumPlan: null,
      premiumEndDate: new Date(),
      revokedBy: getCurrentUserUid() || 'browser-console',
      revokedAt: new Date()
    });
    
    console.log(`✅ Successfully revoked premium access`);
    return true;
    
  } catch (error) {
    console.error('❌ Error revoking premium access:', error);
    return false;
  }
}

// Check premium status of a user
async function checkPremiumStatus(userId) {
  try {
    console.log(`🔍 Checking premium status for user: ${userId}`);
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error(`❌ User ${userId} not found`);
      return;
    }
    
    const userData = userSnap.data();
    console.log(`👤 User: ${userData.name || userData.email}`);
    console.log(`👑 Premium: ${userData.premium ? 'Yes' : 'No'}`);
    
    if (userData.premium) {
      console.log(`📋 Plan: ${userData.premiumPlan}`);
      console.log(`📅 Start Date: ${userData.premiumStartDate?.toDate?.()?.toLocaleDateString() || 'N/A'}`);
      console.log(`📅 End Date: ${userData.premiumEndDate?.toDate?.()?.toLocaleDateString() || 'N/A'}`);
      
      const endDate = userData.premiumEndDate?.toDate?.() || new Date(userData.premiumEndDate);
      const now = new Date();
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      
      if (endDate < now) {
        console.log(`❌ Premium expired ${Math.abs(daysRemaining)} days ago`);
      } else {
        console.log(`✅ Premium active for ${daysRemaining} more days`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking premium status:', error);
  }
}

// Extend premium access for a user
async function extendPremium(userId, additionalDays) {
  try {
    console.log(`⏰ Extending premium access for user: ${userId}`);
    console.log(`📅 Adding ${additionalDays} days`);
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error(`❌ User ${userId} not found`);
      return false;
    }
    
    const userData = userSnap.data();
    console.log(`👤 Found user: ${userData.name || userData.email}`);
    
    const currentEndDate = userData.premiumEndDate?.toDate?.() || new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setDate(newEndDate.getDate() + additionalDays);
    
    await updateDoc(userRef, {
      premiumEndDate: newEndDate,
      extendedBy: getCurrentUserUid() || 'browser-console',
      extendedAt: new Date()
    });
    
    console.log(`✅ Successfully extended premium access!`);
    console.log(`📅 New expiry date: ${newEndDate.toLocaleDateString()}`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Error extending premium access:', error);
    return false;
  }
}

// Quick grant functions for common scenarios
async function grantTrial(userId) {
  return grantPremium(userId, 'trial', 7);
}

async function grantMonthly(userId) {
  return grantPremium(userId, 'monthly', 30);
}

async function grantAnnual(userId) {
  return grantPremium(userId, 'annual', 365);
}

async function grantLifetime(userId) {
  return grantPremium(userId, 'lifetime', 36500); // 100 years
}

// Helper function to get user UID from email (if you know the email)
async function findUserByEmail(email) {
  try {
    // This would require a query, but for simplicity, we'll prompt for UID
    console.log(`🔍 To find user by email, you'll need to provide the UID manually`);
    console.log(`📧 Email: ${email}`);
    console.log(`💡 You can find the UID in Firebase Console or by checking the user's profile`);
    return prompt('Enter the user UID:');
  } catch (error) {
    console.error('❌ Error finding user:', error);
    return null;
  }
}

// Display available functions
console.log(`
🌙 DreamDive Premium Management Console

Available functions:

📋 Grant Premium Access:
  grantPremium(userId, plan, durationDays)
  grantTrial(userId)           // 7 days
  grantMonthly(userId)         // 30 days
  grantAnnual(userId)          // 365 days
  grantLifetime(userId)        // 100 years

🚫 Revoke Premium:
  revokePremium(userId)

🔍 Check Status:
  checkPremiumStatus(userId)

⏰ Extend Premium:
  extendPremium(userId, additionalDays)

🔍 Find User:
  findUserByEmail(email)

Examples:
  grantTrial('user123')
  grantMonthly('user123')
  checkPremiumStatus('user123')
  revokePremium('user123')
`);

// Make functions globally available
window.grantPremium = grantPremium;
window.revokePremium = revokePremium;
window.checkPremiumStatus = checkPremiumStatus;
window.extendPremium = extendPremium;
window.grantTrial = grantTrial;
window.grantMonthly = grantMonthly;
window.grantAnnual = grantAnnual;
window.grantLifetime = grantLifetime;
window.findUserByEmail = findUserByEmail;

console.log('✅ Premium management functions loaded!'); 