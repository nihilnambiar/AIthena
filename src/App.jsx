import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./Home.jsx";
import InsertDream from "./InsertDream.jsx";
import LoginPage from "./LoginPage.jsx";
import SignUpPage from "./SignUpPage.jsx";
import Terms from "./Terms.jsx";
import Privacy from "./Privacy.jsx";
import { LegalFooter } from "./LegalFooter";
import { AuthProvider, useAuth } from "./AuthContext";
import SharedDreamLanding from "./SharedDreamLanding.jsx";
import SplashScreen from "./SplashScreen.jsx";
import FloatingFeedbackButton from "./FloatingFeedbackButton.jsx";
import DreamApp from "./DreamApp.jsx";

// Lazy load premium components for better performance
const Premium = lazy(() => import("./Premium.jsx"));
const AdminPanel = lazy(() => import("./AdminPanel.jsx"));

// Error Boundary for premium components
class PremiumErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Premium component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-white/70 mb-4">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for lazy-loaded premium features
const PremiumLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p>Loading premium features...</p>
    </div>
  </div>
);

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dream" element={user ? <DreamApp /> : <Navigate to="/login" replace />} />
      <Route path="/premium" element={<Premium user={user} />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dream" replace />} />
      <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/dream" replace />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/share/dream/:id" element={<SharedDreamLanding />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Extra logging for debugging
  console.log('[AppContent] user:', user, 'loading:', loading, 'location:', location.pathname);

  if (loading) {
    return <SplashScreen />;
  }

  const showPoeticFooter = location.pathname === "/dream";
  const showLegalFooter = location.pathname === "/" || location.pathname === "/premium";

  return (
    <div className="App" key={user ? user.uid : "nouser"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dream" replace />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/dream" replace />} />
        <Route path="/dream" element={user ? <DreamApp /> : <Navigate to="/login" replace />} />
        <Route 
          path="/premium" 
          element={
            <PremiumErrorBoundary>
              <Suspense fallback={<PremiumLoading />}>
                <Premium user={user} />
              </Suspense>
            </PremiumErrorBoundary>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PremiumErrorBoundary>
              <Suspense fallback={<PremiumLoading />}>
                <AdminPanel />
              </Suspense>
            </PremiumErrorBoundary>
          } 
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/share/dream/:id" element={<SharedDreamLanding />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showLegalFooter && <LegalFooter />}
      <FloatingFeedbackButton />
    </div>
  );
}

// Add a global error boundary for the main app
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Global app error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-white/70 mb-4">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalErrorBoundary>
          <AppContent />
        </GlobalErrorBoundary>
      </Router>
    </AuthProvider>
  );
}
