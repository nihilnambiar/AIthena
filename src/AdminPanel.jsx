import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import { 
  Crown, 
  Users, 
  Search, 
  Filter, 
  Check, 
  X, 
  Calendar, 
  Mail, 
  User, 
  Shield, 
  Zap,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Star,
  Clock
} from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, premium, free
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantPlan, setGrantPlan] = useState("monthly");
  const [grantDuration, setGrantDuration] = useState(30); // days
  const [updating, setUpdating] = useState(false);

  // Check if current user is admin (you can modify this logic)
  const isAdmin = user?.email === "admin@dreamdive.app" || 
                  user?.email === "get2nihil@gmail.com" || 
                  user?.uid === "admin_uid" ||
                  user?.uid === "your-admin-uid";

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "premium" && user.premium) ||
                         (filterStatus === "free" && !user.premium);
    
    return matchesSearch && matchesFilter;
  });

  const grantPremiumAccess = async (userId, plan, duration) => {
    setUpdating(true);
    try {
      const userRef = doc(db, "users", userId);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);
      
      await updateDoc(userRef, {
        premium: true,
        premiumPlan: plan,
        premiumStartDate: new Date(),
        premiumEndDate: endDate,
        grantedBy: user.uid,
        grantedAt: new Date()
      });
      
      // Refresh users list
      await fetchUsers();
      setShowGrantModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error granting premium access:", error);
      alert("Failed to grant premium access");
    } finally {
      setUpdating(false);
    }
  };

  const revokePremiumAccess = async (userId) => {
    if (!confirm("Are you sure you want to revoke premium access for this user?")) return;
    
    setUpdating(true);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        premium: false,
        premiumPlan: null,
        premiumEndDate: new Date(),
        revokedBy: user.uid,
        revokedAt: new Date()
      });
      
      await fetchUsers();
    } catch (error) {
      console.error("Error revoking premium access:", error);
      alert("Failed to revoke premium access");
    } finally {
      setUpdating(false);
    }
  };

  const extendPremiumAccess = async (userId, additionalDays) => {
    setUpdating(true);
    try {
      const userRef = doc(db, "users", userId);
      const currentUser = users.find(u => u.id === userId);
      const currentEndDate = currentUser.premiumEndDate?.toDate?.() || new Date();
      const newEndDate = new Date(currentEndDate);
      newEndDate.setDate(newEndDate.getDate() + additionalDays);
      
      await updateDoc(userRef, {
        premiumEndDate: newEndDate,
        extendedBy: user.uid,
        extendedAt: new Date()
      });
      
      await fetchUsers();
    } catch (error) {
      console.error("Error extending premium access:", error);
      alert("Failed to extend premium access");
    } finally {
      setUpdating(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-white/70">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              Admin Panel
            </h1>
            <p className="text-white/70 mt-2">Manage premium access and user subscriptions</p>
          </div>
          <motion.button
            onClick={fetchUsers}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl p-6 border border-yellow-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Premium Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.premium).length}</p>
              </div>
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Free Users</p>
                <p className="text-2xl font-bold">{users.filter(u => !u.premium).length}</p>
              </div>
              <User className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {users.length > 0 ? Math.round((users.filter(u => u.premium).length / users.length) * 100) : 0}%
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Users</option>
            <option value="premium">Premium Only</option>
            <option value="free">Free Only</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Expires</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userData, index) => (
                  <motion.tr
                    key={userData.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {userData.photo ? (
                          <img src={userData.photo} alt={userData.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{userData.name}</p>
                          <p className="text-sm text-white/60">{userData.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {userData.premium ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                          <User className="w-3 h-3" />
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {userData.premiumPlan ? (
                        <span className="text-sm text-white/80 capitalize">{userData.premiumPlan}</span>
                      ) : (
                        <span className="text-sm text-white/40">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {userData.premiumEndDate ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-white/60" />
                          <span className="text-sm text-white/80">
                            {userData.premiumEndDate.toDate?.()?.toLocaleDateString() || 
                             new Date(userData.premiumEndDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-white/40">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => {
                            setSelectedUser(userData);
                            setShowUserModal(true);
                          }}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        
                        {!userData.premium ? (
                          <motion.button
                            onClick={() => {
                              setSelectedUser(userData);
                              setShowGrantModal(true);
                            }}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        ) : (
                          <motion.button
                            onClick={() => revokePremiumAccess(userData.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-2xl w-full border border-white/20 p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-white/60 hover:text-white text-2xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {selectedUser.photo ? (
                    <img src={selectedUser.photo} alt={selectedUser.name} className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedUser.name}</h3>
                    <p className="text-white/60">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">Premium Status</p>
                    <p className="text-white font-semibold">
                      {selectedUser.premium ? "Active" : "Inactive"}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">Plan</p>
                    <p className="text-white font-semibold capitalize">
                      {selectedUser.premiumPlan || "Free"}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">Start Date</p>
                    <p className="text-white font-semibold">
                      {selectedUser.premiumStartDate ? 
                        selectedUser.premiumStartDate.toDate?.()?.toLocaleDateString() || 
                        new Date(selectedUser.premiumStartDate).toLocaleDateString() : 
                        "N/A"}
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm">End Date</p>
                    <p className="text-white font-semibold">
                      {selectedUser.premiumEndDate ? 
                        selectedUser.premiumEndDate.toDate?.()?.toLocaleDateString() || 
                        new Date(selectedUser.premiumEndDate).toLocaleDateString() : 
                        "N/A"}
                    </p>
                  </div>
                </div>
                
                {selectedUser.premium && (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => extendPremiumAccess(selectedUser.id, 30)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Extend 30 Days
                    </motion.button>
                    <motion.button
                      onClick={() => extendPremiumAccess(selectedUser.id, 365)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Extend 1 Year
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grant Premium Modal */}
      <AnimatePresence>
        {showGrantModal && selectedUser && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full border border-white/20 p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Grant Premium Access</h2>
                <p className="text-white/60 mt-2">Give premium access to {selectedUser.name}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Plan Type</label>
                  <select
                    value={grantPlan}
                    onChange={(e) => setGrantPlan(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm mb-2">Duration (days)</label>
                  <input
                    type="number"
                    value={grantDuration}
                    onChange={(e) => setGrantDuration(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="1"
                    max="3650"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => setShowGrantModal(false)}
                  className="flex-1 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => grantPremiumAccess(selectedUser.id, grantPlan, grantDuration)}
                  disabled={updating}
                  className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-xl transition disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {updating ? "Granting..." : "Grant Access"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel; 