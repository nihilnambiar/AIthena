#!/usr/bin/env node

/**
 * Script to grant premium access to users
 * Usage: node scripts/grant-premium.js <userId> [plan] [duration]
 * 
 * Examples:
 * node scripts/grant-premium.js user123 monthly 30
 * node scripts/grant-premium.js user123 annual 365
 * node scripts/grant-premium.js user123 lifetime
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');

// Your Firebase config - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function grantPremiumAccess(userId, plan = 'monthly', durationDays = 30) {
  try {
    console.log(`Granting premium access to user: ${userId}`);
    console.log(`Plan: ${plan}, Duration: ${durationDays} days`);
    
    const userRef = doc(db, "users", userId);
    
    // Check if user exists
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error(`❌ User ${userId} not found`);
      return false;
    }
    
    const userData = userSnap.data();
    console.log(`Found user: ${userData.name || userData.email}`);
    
    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    
    // Update user document
    await updateDoc(userRef, {
      premium: true,
      premiumPlan: plan,
      premiumStartDate: new Date(),
      premiumEndDate: endDate,
      grantedBy: 'script',
      grantedAt: new Date()
    });
    
    console.log(`✅ Successfully granted premium access to ${userData.name || userData.email}`);
    console.log(`📅 Premium expires: ${endDate.toLocaleDateString()}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error granting premium access:', error);
    return false;
  }
}

async function revokePremiumAccess(userId) {
  try {
    console.log(`Revoking premium access from user: ${userId}`);
    
    const userRef = doc(db, "users", userId);
    
    // Check if user exists
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error(`❌ User ${userId} not found`);
      return false;
    }
    
    const userData = userSnap.data();
    console.log(`Found user: ${userData.name || userData.email}`);
    
    // Update user document
    await updateDoc(userRef, {
      premium: false,
      premiumPlan: null,
      premiumEndDate: new Date(),
      revokedBy: 'script',
      revokedAt: new Date()
    });
    
    console.log(`✅ Successfully revoked premium access from ${userData.name || userData.email}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error revoking premium access:', error);
    return false;
  }
}

async function checkPremiumStatus(userId) {
  try {
    console.log(`Checking premium status for user: ${userId}`);
    
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error(`❌ User ${userId} not found`);
      return;
    }
    
    const userData = userSnap.data();
    console.log(`User: ${userData.name || userData.email}`);
    console.log(`Premium: ${userData.premium ? 'Yes' : 'No'}`);
    
    if (userData.premium) {
      console.log(`Plan: ${userData.premiumPlan}`);
      console.log(`Start Date: ${userData.premiumStartDate?.toDate?.()?.toLocaleDateString() || 'N/A'}`);
      console.log(`End Date: ${userData.premiumEndDate?.toDate?.()?.toLocaleDateString() || 'N/A'}`);
      
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

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🌙 DreamDive Premium Management Script

Usage:
  node scripts/grant-premium.js <userId> [plan] [duration]
  node scripts/grant-premium.js <userId> revoke
  node scripts/grant-premium.js <userId> status

Examples:
  node scripts/grant-premium.js user123 monthly 30
  node scripts/grant-premium.js user123 annual 365
  node scripts/grant-premium.js user123 lifetime
  node scripts/grant-premium.js user123 revoke
  node scripts/grant-premium.js user123 status

Plans:
  - monthly: Monthly plan
  - annual: Annual plan
  - lifetime: Lifetime access (100 years)
  - trial: 7-day trial
  - quarter: 90-day access

Duration: Number of days (default: 30)
    `);
    return;
  }
  
  const userId = args[0];
  const action = args[1];
  
  if (action === 'revoke') {
    await revokePremiumAccess(userId);
  } else if (action === 'status') {
    await checkPremiumStatus(userId);
  } else {
    // Grant premium access
    const plan = action || 'monthly';
    const duration = parseInt(args[2]) || 30;
    
    // Handle special plans
    let finalPlan = plan;
    let finalDuration = duration;
    
    if (plan === 'lifetime') {
      finalDuration = 36500; // 100 years
    } else if (plan === 'trial') {
      finalDuration = 7;
    } else if (plan === 'quarter') {
      finalDuration = 90;
    }
    
    await grantPremiumAccess(userId, finalPlan, finalDuration);
  }
}

// Run the script
main().then(() => {
  console.log('\n✨ Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Script failed:', error);
  process.exit(1);
}); 