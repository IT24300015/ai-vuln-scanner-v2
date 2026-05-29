import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setSuccess(true);
      setShowTransition(true);
      const dest = location.state?.from?.pathname || '/dashboard';
      transitionTimerRef.current = window.setTimeout(() => {
        setLoading(false);
        redirectTimerRef.current = window.setTimeout(() => {
          navigate(dest, { replace: true, state: { fromLogin: true } });
        }, 650);
      }, 250);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-215 h-215 bg-primary/8 rounded-full blur-[140px] animate-float-up"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,255,155,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_24%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.82),rgba(6,11,16,0.92))]"></div>
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6 glow soft-ring relative overflow-hidden">
            {success ? (
              <CheckCircle2 className="w-10 h-10 text-primary animate-pop-in" />
            ) : (
              <Shield className="w-10 h-10 text-primary" />
            )}
            {success && <span className="absolute inset-0 rounded-2xl border border-primary/30 animate-success-pulse"></span>}
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            VulnScanner <span className="text-primary italic">AI</span>
          </h1>
          <p className="text-gray-500 mt-2">Authenticate with the Intelligence Ecosystem</p>
        </div>

        <div className={`glass panel-gradient p-8 rounded-3xl border-primary/10 relative overflow-hidden ${showTransition ? 'animate-pop-in' : ''}`}>
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {success && !error && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm animate-pop-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Login verified. Opening dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Strategic Identifier (Email or Username)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-gray-600"
                  placeholder="admin@enterprise.ai or username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Security Token (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-white placeholder:text-gray-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_26px_rgba(45,255,155,0.45)] transition-all disabled:opacity-50 disabled:shadow-none font-black uppercase tracking-widest"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Initialize Session'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {showTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,255,155,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.16),transparent_26%)]"></div>
          <div className="absolute inset-0 opacity-35 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.10),transparent)] animate-[pan_1.1s_linear_infinite]"></div>
          <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6 animate-pop-in">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_60px_rgba(45,255,155,0.22)]">
              <span className="absolute inset-0 rounded-full border border-primary/20 animate-success-pulse"></span>
              <CheckCircle2 className="w-12 h-12 text-primary animate-pop-in" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.35em]">
                <Sparkles className="w-3 h-3" />
                Access Granted
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="mt-3 text-gray-400 max-w-sm">
                Building your secure workspace and opening the dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;