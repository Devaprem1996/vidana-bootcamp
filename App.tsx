
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminModules from './pages/AdminModules';
import TopicPage from './pages/TopicPage';

const { HashRouter: Router, Routes, Route, Navigate } = ReactRouterDOM as any;

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: 'admin' | 'intern' }> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  
  // Show a simple loader while checking session status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 dark:border-brand-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/dashboard'} replace />;
  }

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="intern">
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Generic Topic Route handling all slugs (n8n, vibe-coding, etc.) */}
      <Route path="/topic/:slug" element={
        <ProtectedRoute>
          <TopicPage />
        </ProtectedRoute>
      } />

      <Route path="/admin-dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin-modules" element={
        <ProtectedRoute requiredRole="admin">
           <AdminModules /> 
        </ProtectedRoute>
      } />
      
      <Route path="/admin-students" element={
        <ProtectedRoute requiredRole="admin">
           <AdminDashboard /> 
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
