import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      // navigation handled by useEffect
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00ff88 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-[0_0_30px_rgba(0,255,136,0.2)]">
              <Shield size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              VulnScanner <span className="text-primary">AI</span>
            </h1>
            <p className="text-gray-400 mt-2">Sign in to your security console</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500 text-sm items-center animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-white"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <footer className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline decoration-primary/30">
              Create Account
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
