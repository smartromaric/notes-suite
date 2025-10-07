import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { useAuth } from './hooks/useAuth';
import { loadUserFromStorage } from './store/auth/authSlice';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NoteDetailPage from './pages/NoteDetailPage';
import CreateEditNotePage from './pages/CreateEditNotePage';
import ShareNotePage from './pages/ShareNotePage';
import SharePublicPage from './pages/SharePublicPage';
import PublicNotePage from './pages/PublicNotePage';
import SearchNotesPage from './pages/SearchNotesPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Load user from storage on app start
    store.dispatch(loadUserFromStorage());
  }, []);

  if (isLoading) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route path="/p/:token" element={<PublicNotePage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id"
            element={
              <ProtectedRoute>
                <NoteDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/edit"
            element={
              <ProtectedRoute>
                <CreateEditNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/new"
            element={
              <ProtectedRoute>
                <CreateEditNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/share"
            element={
              <ProtectedRoute>
                <ShareNotePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:id/share/public"
            element={
              <ProtectedRoute>
                <SharePublicPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchNotesPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
          />
        </Routes>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;