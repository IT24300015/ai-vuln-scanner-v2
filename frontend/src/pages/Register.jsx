import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00ff88 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-gray-400 mt-2">Join the future of web security</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500 text-sm items-center">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex gap-3 text-primary text-sm items-center">
              <CheckCircle2 size={18} />
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-background/50 border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-all text-white"
                  placeholder="cyber_expert"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background/50 border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-all text-white"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-background/50 border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-all text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-background/50 border border-border rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary transition-all text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={isLoading || success}
              className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)] mt-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <footer className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;
