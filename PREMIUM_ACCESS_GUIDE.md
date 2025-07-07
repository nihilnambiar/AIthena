# 🌙 DreamDive Premium Access Management Guide

This guide explains all the different ways you can grant premium access to users in DreamDive.

## 📋 Overview

DreamDive premium access is managed through Firebase Firestore. Users have a `premium` field in their user document that controls access to premium features.

## 🛠️ Methods to Grant Premium Access

### 1. **Admin Panel (Recommended)**

The easiest way to manage premium access is through the built-in admin panel.

**Access:** Navigate to `/admin` in your DreamDive app

**Features:**

- View all users and their premium status
- Grant premium access with custom duration
- Revoke premium access
- Extend existing premium subscriptions
- Search and filter users
- View detailed user information

**Admin Access Setup:**

1. Open `src/AdminPanel.jsx`
2. Modify the `isAdmin` check on line 42:
   ```javascript
   const isAdmin =
     user?.email === "your-admin-email@domain.com" ||
     user?.uid === "your-admin-uid";
   ```
3. Replace with your admin email or UID

**Usage:**

1. Log in with your admin account
2. Go to `/admin`
3. Search for the user you want to grant access to
4. Click the "+" button to grant premium access
5. Choose plan type and duration
6. Click "Grant Access"

### 2. **Browser Console Script**

For quick one-time grants, you can use the browser console script.

**Setup:**

1. Open your DreamDive app in the browser
2. Open browser console (F12)
3. Copy and paste the contents of `scripts/browser-premium-grant.js`
4. Use the available functions

**Available Functions:**

```javascript
// Grant premium access
grantPremium("user123", "monthly", 30);
grantTrial("user123"); // 7 days
grantMonthly("user123"); // 30 days
grantAnnual("user123"); // 365 days
grantLifetime("user123"); // 100 years

// Revoke premium access
revokePremium("user123");

// Check premium status
checkPremiumStatus("user123");

// Extend premium access
extendPremium("user123", 30); // Add 30 days
```

### 3. **Node.js Script**

For automated or bulk operations, use the Node.js script.

**Setup:**

1. Install dependencies: `npm install firebase`
2. Update Firebase config in `scripts/grant-premium.js`
3. Run the script

**Usage:**

```bash
# Grant monthly premium
node scripts/grant-premium.js user123 monthly 30

# Grant annual premium
node scripts/grant-premium.js user123 annual 365

# Grant lifetime premium
node scripts/grant-premium.js user123 lifetime

# Grant trial
node scripts/grant-premium.js user123 trial

# Revoke premium access
node scripts/grant-premium.js user123 revoke

# Check premium status
node scripts/grant-premium.js user123 status
```

### 4. **Programmatic API**

Use the utility functions directly in your code.

**Import:**

```javascript
import {
  grantPremiumAccess,
  revokePremiumAccess,
  extendPremiumAccess,
  checkPremiumStatus,
  grantLifetimePremium,
  grantPremiumPreset,
} from "./src/utils/premiumUtils";
```

**Usage:**

```javascript
// Grant premium access
await grantPremiumAccess("user123", "monthly", 30, "admin-uid");

// Grant lifetime premium
await grantLifetimePremium("user123", "admin-uid");

// Grant preset duration
await grantPremiumPreset("user123", "trial", "admin-uid");

// Revoke premium access
await revokePremiumAccess("user123", "admin-uid");

// Extend premium access
await extendPremiumAccess("user123", 30, "admin-uid");

// Check premium status
const status = await checkPremiumStatus("user123");
console.log(status);
```

### 5. **Firebase Console (Manual)**

For one-off manual changes, you can use Firebase Console.

**Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your DreamDive project
3. Go to Firestore Database
4. Navigate to `users` collection
5. Find the user document
6. Edit the document and update these fields:
   ```json
   {
     "premium": true,
     "premiumPlan": "monthly",
     "premiumStartDate": "2024-01-01T00:00:00.000Z",
     "premiumEndDate": "2024-02-01T00:00:00.000Z",
     "grantedBy": "admin",
     "grantedAt": "2024-01-01T00:00:00.000Z"
   }
   ```

## 📊 Premium Plans

### Available Plans:

- **trial**: 7 days
- **monthly**: 30 days
- **quarterly**: 90 days
- **annual**: 365 days
- **lifetime**: 100 years (36,500 days)

### User Document Structure:

```json
{
  "uid": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "premium": true,
  "premiumPlan": "monthly",
  "premiumStartDate": "2024-01-01T00:00:00.000Z",
  "premiumEndDate": "2024-02-01T00:00:00.000Z",
  "grantedBy": "admin-uid",
  "grantedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Finding User UIDs

### Method 1: Admin Panel

- Use the admin panel search functionality
- Search by name or email

### Method 2: Firebase Console

1. Go to Firebase Console > Firestore
2. Navigate to `users` collection
3. Find the user by email or name
4. Copy the document ID (this is the UID)

### Method 3: Browser Console

```javascript
// If you know the user's email, you can search in the console
// (This requires additional setup for email queries)
```

### Method 4: User Profile

- Ask the user to check their profile
- The UID is often visible in the URL or profile data

## 🛡️ Security Considerations

### Admin Access Control:

- Only grant admin access to trusted users
- Use email-based admin checks for better security
- Consider implementing role-based access control

### Audit Trail:

- All premium changes are logged with `grantedBy`, `grantedAt`, etc.
- Keep track of who made changes and when

### Rate Limiting:

- Consider implementing rate limits for premium grants
- Monitor for unusual activity

## 🚀 Quick Start

### For Immediate Use:

1. **Set up admin access:**

   ```javascript
   // In src/AdminPanel.jsx, line 42
   const isAdmin = user?.email === "your-email@domain.com";
   ```

2. **Access admin panel:**

   - Log in with your admin account
   - Navigate to `/admin`
   - Start managing premium access

3. **Grant premium to a user:**
   - Search for the user
   - Click the "+" button
   - Choose plan and duration
   - Click "Grant Access"

### For Development/Testing:

1. **Use browser console:**

   - Open browser console (F12)
   - Paste the browser script
   - Use `grantTrial('user123')` for quick testing

2. **Use Node.js script:**
   - Update Firebase config
   - Run `node scripts/grant-premium.js user123 trial`

## 🔧 Troubleshooting

### Common Issues:

1. **"User not found" error:**

   - Verify the user UID is correct
   - Check if the user exists in Firestore

2. **Admin access denied:**

   - Verify your email/UID is in the admin check
   - Check the `isAdmin` condition in AdminPanel.jsx

3. **Premium not showing:**

   - Check if the user has refreshed their session
   - Verify the premium fields are correctly set
   - Check if premium end date is in the future

4. **Firebase connection issues:**
   - Verify Firebase config is correct
   - Check network connectivity
   - Ensure Firebase rules allow admin operations

### Debug Commands:

```javascript
// Check current user's premium status
checkPremiumStatus("current-user-uid");

// Verify admin access
console.log("Is admin:", user?.email === "your-admin-email");

// Check Firebase connection
console.log("Firebase initialized:", !!window.firebase);
```

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify Firebase configuration
3. Ensure proper admin access setup
4. Check Firestore security rules
5. Review the audit trail in Firebase Console

## 🔄 Automation

For bulk operations or automated premium grants:

1. **Use the Node.js script** for batch processing
2. **Create custom scripts** using the utility functions
3. **Set up webhooks** for automatic premium grants
4. **Use Firebase Functions** for server-side automation

---

This guide covers all the methods available for granting premium access in DreamDive. Choose the method that best fits your workflow and security requirements.
