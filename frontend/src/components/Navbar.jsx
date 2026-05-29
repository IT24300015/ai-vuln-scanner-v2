import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.replace('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xl tracking-tight">
            VulnScanner <span className="text-primary italic">AI</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to={{ pathname: '/', hash: '#security' }} title="Open security checklist" aria-label="Security checklist" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Security
          </Link>
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isActive('/dashboard') ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            to="/scan/new" 
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              isActive('/scan/new') ? 'text-primary' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            New Scan
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium">{user?.username}</span>
          <span className="text-xs text-gray-500">{user?.email}</span>
        </div>
        
        <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-primary font-bold border border-primary/20">
          {user?.username?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
        </div>

        <button 
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;