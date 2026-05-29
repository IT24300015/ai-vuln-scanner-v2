import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewScan from './pages/NewScan';
import ScanResults from './pages/ScanResults';
import Report from './pages/Report';

// Components
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading || (token && !user)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-primary font-mono text-xs animate-pulse tracking-[0.2em] uppercase">Initializing secure connection...</div>
      </div>
    );
  }

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black font-sans">
      <Navbar />
      <main className="relative">
         {/* Background Grid Pattern */}
         <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(#00ff88 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
         <div className="relative z-10">
          {children}
         </div>
      </main>
    </div>
  );
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/scan/new" element={
            <ProtectedRoute>
              <NewScan />
            </ProtectedRoute>
          } />
          <Route path="/scan/:id" element={
            <ProtectedRoute>
              <ScanResults />
            </ProtectedRoute>
          } />
          <Route path="/scan/:id/report" element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
