// Quick test to verify admin panel access
console.log('🌙 DreamDive Admin Panel Test');

// Test admin email configuration
const adminEmails = [
  "admin@dreamdive.app",
  "get2nihil@gmail.com"
];

console.log('✅ Admin emails configured:', adminEmails);

// Test instructions
console.log(`
📋 Admin Panel Access Instructions:

1. Open your browser and go to: http://localhost:3000
2. Log in with: get2nihil@gmail.com
3. Navigate to: http://localhost:3000/admin
4. You should see the admin dashboard with user management

🔧 If you can't access the admin panel:
- Make sure you're logged in with get2nihil@gmail.com
- Check the browser console for any errors
- Verify the app is running on localhost:3000

🎯 To grant premium access:
1. Search for a user by name or email
2. Click the green "+" button
3. Choose plan (monthly/annual/lifetime)
4. Set duration in days
5. Click "Grant Access"

✨ The user will immediately have access to:
- Unlimited dream interpretations
- Advanced AI analysis
- Dream sharing cards
- Premium community
- Exclusive premium badge
`);

// Check if running in browser
if (typeof window !== 'undefined') {
  console.log('🌐 Running in browser environment');
  console.log('🔗 Admin panel URL: http://localhost:3000/admin');
} else {
  console.log('🖥️ Running in Node.js environment');
} 