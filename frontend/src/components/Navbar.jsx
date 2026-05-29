import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, Search, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-[60] bg-background border-b border-border h-16 w-full backdrop-blur-md bg-opacity-80">
      <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <Shield className="text-primary w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tighter">VulnScanner <span className="text-primary">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1 h-full">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive ? 'text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(0,255,136,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink 
              to="/scan/new" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive ? 'text-primary bg-primary/10 shadow-[inset_0_0_10px_rgba(0,255,136,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Search size={18} />
              New Scan
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-white leading-none">{user?.username}</div>
              <div className="text-[10px] text-gray-500 font-medium uppercase mt-1 tracking-wider">{user?.email}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg shadow-[0_0_15px_rgba(0,255,136,0.1)]">
              {user?.username?.[0]?.toUpperCase() || <User size={20} />}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 rounded-xl border border-border text-gray-400 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
            title="Logout"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
