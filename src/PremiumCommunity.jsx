import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageCircle, Heart, Share2, Send, Crown, Sparkles, TrendingUp, Clock, X, Filter, Search, Edit, Trash2 } from "lucide-react";
import { useAuth } from "./AuthContext";
import { db, collection, addDoc, getDocs, query, orderBy, doc, updateDoc, getDoc, serverTimestamp, onSnapshot, startAfter, deleteDoc } from "./firebase";
import { increment, arrayUnion, arrayRemove, limit, where, getCountFromServer, Timestamp } from "firebase/firestore";
import confetti from "canvas-confetti";
import { Tooltip } from "@headlessui/react";

const PremiumCommunity = ({ onClose }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my-posts', 'trending'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  // Edit and delete states
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Enhanced sample posts for demo
  const samplePosts = useMemo(() => [
    {
      id: 1,
      author: "DreamExplorer",
      avatar: "🌙",
      content: "Last night I had the most vivid dream about flying over a crystal city. The AI analysis revealed it was about breaking free from limitations. Anyone else had similar dreams? The symbolism was incredible!",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      tags: ["flying", "freedom", "crystal", "limitations"],
      isPremium: true,
      isLiked: false,
      userId: "user1"
    },
    {
      id: 2,
      author: "LunaDreamer",
      avatar: "✨",
      content: "The symbolism analysis feature is incredible! It helped me understand why I keep dreaming about water. Apparently it's connected to my emotional state. The community insights here are so valuable. #DreamAnalysis",
      likes: 18,
      comments: 5,
      timestamp: "4 hours ago",
      tags: ["water", "emotions", "symbolism", "recurring"],
      isPremium: true,
      isLiked: false,
      userId: "user2"
    },
    {
      id: 3,
      author: "NightVoyager",
      avatar: "🌟",
      content: "Just shared my dream interpretation card on social media! The design is beautiful and my friends loved it. This premium feature is definitely worth it. The sharing cards are absolutely stunning!",
      likes: 31,
      comments: 12,
      timestamp: "6 hours ago",
      tags: ["sharing", "social", "cards", "premium"],
      isPremium: true,
      isLiked: false,
      userId: "user3"
    },
    {
      id: 4,
      author: "DreamWeaver",
      avatar: "💫",
      content: "Had a lucid dream last night and used the advanced analysis to understand the deeper meaning. The psychological insights were mind-blowing! Anyone else into lucid dreaming?",
      likes: 42,
      comments: 15,
      timestamp: "8 hours ago",
      tags: ["lucid", "psychological", "advanced", "insights"],
      isPremium: true,
      isLiked: false,
      userId: "user4"
    },
    {
      id: 5,
      author: "StarGazer",
      avatar: "🌌",
      content: "The premium community is amazing! So many insightful discussions about dream symbolism. Love how we can share experiences and learn from each other. #DreamCommunity",
      likes: 15,
      comments: 6,
      timestamp: "12 hours ago",
      tags: ["community", "symbolism", "learning", "sharing"],
      isPremium: true,
      isLiked: false,
      userId: "user5"
    }
  ], []);

  useEffect(() => {
    // Fetch posts from Firestore
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const posts = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            isLiked: data.likedBy && user?.uid ? data.likedBy.includes(user.uid) : false,
            likedBy: data.likedBy || []
          };
        });
        setPosts(posts);
      } catch (e) {
        // Optionally handle error
      }
    };
    fetchPosts();
  }, [user]);

  const handleSubmitPost = useCallback(async () => {
    if (!newPost.trim()) return;
    setLoading(true);
    try {
      const postData = {
        author: user?.name || "Anonymous",
        avatar: "🌙",
        content: newPost,
        likes: 0,
        comments: 0,
        tags: extractTags(newPost),
        isPremium: true,
        isLiked: false,
        userId: user?.uid,
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, "community_posts"), postData);
      setPosts(prev => [{ id: docRef.id, ...postData, createdAt: new Date() }, ...prev]);
      setNewPost("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#a855f7', '#c084fc']
      });
    } catch (error) {
      alert("Failed to post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [newPost, user]);

  // Edit post handler
  const handleEditPost = useCallback(async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    setEditingPostId(postId);
    setEditContent(post.content);
  }, [posts]);

  // Save edit handler
  const handleSaveEdit = useCallback(async (postId) => {
    if (!editContent.trim()) return;
    
    try {
      // In a real app, you'd update Firestore
      // await updateDoc(doc(db, "community_posts", postId), { content: editContent });
      
      // For demo, update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, content: editContent, tags: extractTags(editContent) }
          : post
      ));
      
      setEditingPostId(null);
      setEditContent("");
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post. Please try again.");
    }
  }, [editContent]);

  // Cancel edit handler
  const handleCancelEdit = useCallback(() => {
    setEditingPostId(null);
    setEditContent("");
  }, []);

  // Delete post handler
  const handleDeletePost = useCallback(async (postId) => {
    try {
      await deleteDoc(doc(db, "community_posts", postId));
      
      // For demo, remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
      setShowDeleteConfirm(null);
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  }, []);

  const extractTags = (text) => {
    const hashtags = text.match(/#\w+/g);
    return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
  };

  const handleLike = useCallback(async (postId) => {
    if (!user?.uid) return;
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likedBy && post.likedBy.includes(user.uid);
        return {
          ...post,
          isLiked: !hasLiked,
          likes: post.likes + (hasLiked ? -1 : 1),
          likedBy: hasLiked ? post.likedBy.filter(id => id !== user.uid) : [...(post.likedBy || []), user.uid]
        };
      }
      return post;
    }));
    // Update Firestore
    try {
      const postRef = doc(db, "community_posts", postId);
      const postSnap = await getDoc(postRef);
      const postData = postSnap.data();
      const hasLiked = postData.likedBy && postData.likedBy.includes(user.uid);
      await updateDoc(postRef, {
        likes: increment(hasLiked ? -1 : 1),
        likedBy: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (e) {
      // Optionally handle error
    }
  }, [user]);

  const handleShare = useCallback((postId) => {
    const url = `${window.location.origin}/share/community/${postId}`;
    window.navigator.clipboard.writeText(url);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    
    // Filter by tab
    if (activeTab === 'my-posts') {
      filtered = filtered.filter(post => post.userId === user?.uid);
    } else if (activeTab === 'trending') {
      filtered = filtered.filter(post => post.likes >= 10);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Filter by topic
    if (selectedTopic) {
      filtered = filtered.filter(post => 
        post.tags.includes(selectedTopic)
      );
    }
    
    return filtered;
  }, [posts, activeTab, searchQuery, selectedTopic, user]);

  const popularTopics = useMemo(() => {
    const topicCounts = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([topic]) => topic);
  }, [posts]);

  const [activeStats, setActiveStats] = useState({
    total: 0,
    premium: 0,
    nonPremium: 0
  });

  // Fetch accurate community stats
  useEffect(() => {
    const fetchStats = async () => {
      // Fetch all users who have ever logged in
      const usersSnap = await getDocs(query(collection(db, "users"), where("hasLoggedIn", "==", true)));
      const total = usersSnap.size;
      let premium = 0;
      let nonPremium = 0;
      usersSnap.forEach(doc => {
        const data = doc.data();
        if (data.premium) premium++;
        else nonPremium++;
      });
      setActiveStats({ total, premium, nonPremium });
      // 2. Posts Today
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const postsSnap = await getDocs(collection(db, "community_posts"));
      let postsToday = 0;
      let totalLikes = 0;
      postsSnap.forEach(doc => {
        const data = doc.data();
        if (data.createdAt && data.createdAt.toDate && data.createdAt.toDate() > since) postsToday++;
        totalLikes += data.likes || 0;
      });
      // 3. Dreams Analyzed (sum all users' dreams)
      let dreamsAnalyzed = 0;
      const userIds = usersSnap.docs.map(doc => doc.id);
      for (const uid of userIds) {
        const dreamsSnap = await getDocs(collection(db, "users", uid, "dreams"));
        dreamsAnalyzed += dreamsSnap.size;
      }
      setCommunityStats({ activeMembers: total, postsToday, dreamsAnalyzed, totalLikes });
    };
    fetchStats();
  }, [posts.length]);

  const [openComments, setOpenComments] = useState({}); // { [postId]: true/false }
  const [comments, setComments] = useState({}); // { [postId]: [comments] }
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: "" }
  const [commentsLoading, setCommentsLoading] = useState({}); // { [postId]: true/false }

  const COMMENTS_PAGE_SIZE = 10;
  const [commentsPage, setCommentsPage] = useState({}); // { [postId]: 1 }
  const [commentsLastDoc, setCommentsLastDoc] = useState({}); // { [postId]: lastDoc }
  const [commentsHasMore, setCommentsHasMore] = useState({}); // { [postId]: true/false }
  const commentsUnsub = useRef({});

  const fetchComments = useCallback((postId, page = 1, append = false) => {
    setCommentsLoading(prev => ({ ...prev, [postId]: true }));
    if (commentsUnsub.current[postId]) commentsUnsub.current[postId]();
    let qRef = collection(db, "community_posts", postId, "comments");
    let qBase = query(qRef, orderBy("createdAt", "asc"), limit(COMMENTS_PAGE_SIZE * page));
    commentsUnsub.current[postId] = onSnapshot(qBase, (snap) => {
      const comms = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(prev => ({ ...prev, [postId]: comms }));
      setCommentsLoading(prev => ({ ...prev, [postId]: false }));
      setCommentsPage(prev => ({ ...prev, [postId]: page }));
      setCommentsLastDoc(prev => ({ ...prev, [postId]: snap.docs[snap.docs.length - 1] }));
      setCommentsHasMore(prev => ({ ...prev, [postId]: snap.docs.length === COMMENTS_PAGE_SIZE * page }));
    });
  }, []);

  useEffect(() => () => { // cleanup on unmount
    Object.values(commentsUnsub.current).forEach(unsub => unsub && unsub());
  }, []);

  const handleToggleComments = useCallback((postId) => {
    setOpenComments(prev => {
      const isOpen = !prev[postId];
      if (isOpen && !comments[postId]) fetchComments(postId, 1);
      return { ...prev, [postId]: isOpen };
    });
  }, [comments, fetchComments]);

  const handleLoadMoreComments = (postId) => {
    const nextPage = (commentsPage[postId] || 1) + 1;
    fetchComments(postId, nextPage);
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteDoc(doc(db, "community_posts", postId, "comments", commentId));
      // UI will update in real-time via onSnapshot
    } catch (e) {
      // Optionally handle error
    }
  };

  const handleCommentInput = (postId, value) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleSubmitComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text || !user) return;
    const comment = {
      author: user.name || 'Anonymous',
      userId: user.uid,
      text,
      createdAt: serverTimestamp(),
    };
    try {
      const commentsRef = collection(db, "community_posts", postId, "comments");
      const docRef = await addDoc(commentsRef, comment);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), { ...comment, id: docRef.id, createdAt: new Date() }]
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      if (user?.uid && comment.userId && comment.userId !== user.uid) {
        const notifRef = collection(db, "users", comment.userId, "notifications");
        await addDoc(notifRef, {
          type: "comment",
          postId,
          fromUser: user.displayName || user.email || "Someone",
          text: comment.text,
          createdAt: serverTimestamp(),
          read: false,
        });
      }
    } catch (e) {
      // Optionally handle error
    }
  };

  const [editingComment, setEditingComment] = useState({ postId: null, commentId: null });
  const [editingCommentValue, setEditingCommentValue] = useState("");

  const handleEditComment = (postId, comment) => {
    setEditingComment({ postId, commentId: comment.id });
    setEditingCommentValue(comment.text);
  };

  const handleCancelEditComment = () => {
    setEditingComment({ postId: null, commentId: null });
    setEditingCommentValue("");
  };

  const handleSaveEditComment = async (postId, commentId) => {
    const text = editingCommentValue.trim();
    if (!text) return;
    try {
      const commentRef = doc(db, "community_posts", postId, "comments", commentId);
      await updateDoc(commentRef, { text });
      setEditingComment({ postId: null, commentId: null });
      setEditingCommentValue("");
    } catch (e) {
      // Optionally handle error
    }
  };

  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications for current user
  useEffect(() => {
    if (!user?.uid) return;
    const notifRef = collection(db, "users", user.uid, "notifications");
    const q = query(notifRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      const notifs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    });
    return () => unsub();
  }, [user?.uid]);

  // Mark notifications as read
  const markNotificationsRead = async () => {
    if (!user?.uid) return;
    const notifRef = collection(db, "users", user.uid, "notifications");
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => updateDoc(doc(notifRef, n.id), { read: true })));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-white/20 text-white relative"
        >
          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Action completed successfully!</span>
              </motion.div>
            )}
            {shareSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 z-50"
              >
                <Share2 className="w-4 h-4" />
                <span className="font-semibold">Link copied!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30 max-w-md w-full mx-4"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Delete Post?</h3>
                  <p className="text-white/80 mb-6">This action cannot be undone. Are you sure you want to delete this post?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 py-2 px-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeletePost(showDeleteConfirm)}
                      className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Premium Community</h2>
                  <p className="text-white/80 text-sm">Connect with fellow dream explorers</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-2xl hover:bg-white/10 p-2 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-white/10 bg-black/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts, users, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/20 bg-black/10">
            <motion.button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition relative ${
                activeTab === 'all' 
                  ? 'text-purple-300' 
                  : 'text-white/60 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              All Posts
              {activeTab === 'all' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300"
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('my-posts')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition relative ${
                activeTab === 'my-posts' 
                  ? 'text-purple-300' 
                  : 'text-white/60 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              My Posts
              {activeTab === 'my-posts' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300"
                />
              )}
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('trending')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition relative ${
                activeTab === 'trending' 
                  ? 'text-purple-300' 
                  : 'text-white/60 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Trending
              {activeTab === 'trending' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-300"
                />
              )}
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex h-[60vh]">
            {/* Posts Feed */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* New Post Input */}
              <motion.div 
                className="bg-gradient-to-br from-black/30 to-black/20 rounded-2xl p-6 mb-6 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full text-sm font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share your dream experience or ask the community..."
                      className="w-full p-4 bg-black/30 border border-white/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50"
                      rows="3"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        Premium Member
                      </div>
                      <motion.button
                        onClick={handleSubmitPost}
                        disabled={loading || !newPost.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400/50 disabled:to-blue-400/50 text-white px-6 py-2 rounded-xl font-medium transition flex items-center gap-2 shadow-lg"
                      >
                        <Send className="w-4 h-4" />
                        {loading ? 'Posting...' : 'Post'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Posts List */}
              <div className="space-y-6">
                <AnimatePresence>
                  {filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-black/30 to-black/20 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{post.avatar}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{post.author}</span>
                              {post.isPremium && (
                                <motion.div
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                </motion.div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                              <Clock className="w-3 h-3" />
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Edit/Delete buttons - only show for post author */}
                        {post.userId === user?.uid && (
                          <div className="flex items-center gap-2">
                            {editingPostId === post.id ? (
                              <>
                                <motion.button
                                  onClick={() => handleSaveEdit(post.id)}
                                  className="text-green-400 hover:text-green-300 p-1 rounded transition"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Send className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  onClick={handleCancelEdit}
                                  className="text-gray-400 hover:text-gray-300 p-1 rounded transition"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </>
                            ) : (
                              <>
                                <motion.button
                                  onClick={() => handleEditPost(post.id)}
                                  className="text-blue-400 hover:text-blue-300 p-1 rounded transition"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() => setShowDeleteConfirm(post.id)}
                                  className="text-red-400 hover:text-red-300 p-1 rounded transition"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Post Content */}
                      {editingPostId === post.id ? (
                        <div className="mb-4">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-4 bg-black/30 border border-white/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                            rows="3"
                          />
                        </div>
                      ) : (
                        <p className="text-white/90 mb-4 leading-relaxed">{post.content}</p>
                      )}

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              className="bg-purple-400/20 text-purple-200 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-purple-400/30 transition"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedTopic(selectedTopic === tag ? null : tag)}
                            >
                              #{tag}
                            </motion.span>
                          ))}
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div className="flex items-center gap-6">
                          <motion.button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 transition ${
                              post.isLiked ? 'text-red-400' : 'text-white/60 hover:text-red-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className={`w-4 h-4${post.isLiked ? ' fill-current' : ''}`} />
                            <span className="text-sm">{post.likes}</span>
                          </motion.button>
                          <motion.button 
                            className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleToggleComments(post.id)}
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{comments[post.id]?.length ?? post.comments}</span>
                          </motion.button>
                          <motion.button 
                            className="flex items-center gap-2 text-white/60 hover:text-green-400 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">Share</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Comments Section */}
                      {openComments[post.id] && (
                        <div className="mt-4 bg-black/30 rounded-xl p-4 border border-white/10">
                          {commentsLoading[post.id] ? (
                            <div className="text-white/60 text-sm">Loading comments...</div>
                          ) : (
                            <>
                              <div className="space-y-3 mb-3">
                                {comments[post.id]?.length > 0 ? comments[post.id].map(c => (
                                  <div key={c.id} className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400/40 to-blue-400/40 flex items-center justify-center text-white font-bold text-lg">
                                      {c.author?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-semibold text-white/90 text-sm flex items-center gap-2">{c.author || 'Anonymous'}
                                        {c.userId === user?.uid && editingComment.commentId !== c.id && (
                                          <>
                                            <button onClick={() => handleEditComment(post.id, c)} className="ml-2 text-xs text-blue-400 hover:text-blue-600">Edit</button>
                                            <button onClick={() => handleDeleteComment(post.id, c.id)} className="ml-2 text-xs text-red-400 hover:text-red-600">Delete</button>
                                          </>
                                        )}
                                        {c.userId === user?.uid && editingComment.commentId === c.id && (
                                          <>
                                            <button onClick={handleCancelEditComment} className="ml-2 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                                            <button onClick={() => handleSaveEditComment(post.id, c.id)} className="ml-2 text-xs text-green-400 hover:text-green-600" disabled={!editingCommentValue.trim()}>Save</button>
                                          </>
                                        )}
                                      </div>
                                      {editingComment.commentId === c.id ? (
                                        <input
                                          type="text"
                                          value={editingCommentValue}
                                          onChange={e => setEditingCommentValue(e.target.value)}
                                          className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none mb-1 mt-1"
                                          onKeyDown={e => { if (e.key === 'Enter' && editingCommentValue.trim()) handleSaveEditComment(post.id, c.id); }}
                                        />
                                      ) : (
                                        <div className="text-white/80 text-base mb-1">{c.text}</div>
                                      )}
                                      <div className="text-xs text-white/40">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ''}</div>
                                    </div>
                                  </div>
                                )) : (
                                  <div className="text-white/60 text-sm">No comments yet.</div>
                                )}
                              </div>
                              {commentsHasMore[post.id] && (
                                <button
                                  onClick={() => handleLoadMoreComments(post.id)}
                                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold mt-2"
                                >
                                  Load more
                                </button>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  type="text"
                                  value={commentInputs[post.id] || ''}
                                  onChange={e => handleCommentInput(post.id, e.target.value)}
                                  className="flex-1 p-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none"
                                  placeholder="Add a comment..."
                                  onKeyDown={e => { if (e.key === 'Enter') handleSubmitComment(post.id); }}
                                />
                                <button
                                  onClick={() => handleSubmitComment(post.id)}
                                  className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
                                  disabled={!commentInputs[post.id]?.trim()}
                                >
                                  Post
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 bg-black/20 p-6 border-l border-white/20 overflow-y-auto max-h-[60vh]">
              <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Community Stats
              </h3>
              
              <div className="space-y-4 mb-8">
                <motion.div 
                  className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-white/10 relative group"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Active Members</span>
                    <span className="font-semibold text-purple-300 cursor-pointer group-hover:underline">
                      <Tooltip
                        as="div"
                        className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-xl bg-black/90 p-4 text-white text-sm shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
                        open={undefined}
                      >
                        <div className="mb-2 font-semibold text-purple-200">Active Members Breakdown</div>
                        <div className="mb-1">Premium users: <span className="font-bold text-yellow-300">{activeStats.premium}</span></div>
                        <div className="mb-1">Non-premium users: <span className="font-bold text-green-300">{activeStats.nonPremium}</span></div>
                        <div>Total users: <span className="font-bold text-blue-300">{activeStats.total}</span></div>
                      </Tooltip>
                      {activeStats.total.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Posts Today</span>
                    <span className="font-semibold text-green-300">{communityStats.postsToday}</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Dreams Analyzed</span>
                    <span className="font-semibold text-blue-300">{communityStats.dreamsAnalyzed.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Total Likes</span>
                    <span className="font-semibold text-yellow-300">{communityStats.totalLikes.toLocaleString()}</span>
                  </div>
                </motion.div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  Popular Topics
                </h4>
                <div className="space-y-2">
                  {popularTopics.map((topic) => (
                    <motion.div 
                      key={topic} 
                      className={`rounded-xl p-3 cursor-pointer transition ${
                        selectedTopic === topic 
                          ? 'bg-purple-500/30 border border-purple-400/50' 
                          : 'bg-black/30 hover:bg-black/50 border border-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                    >
                      <span className="text-sm text-white/80">#{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedTopic) && (
                <motion.button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTopic(null);
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl transition flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter className="w-4 h-4" />
                  Clear Filters
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PremiumCommunity; 