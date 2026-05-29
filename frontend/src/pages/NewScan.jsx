import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createScan, getScan } from '../services/api';
import { Shield, Globe, Loader2, CheckCircle2, AlertCircle, Search, ArrowRight, Info } from 'lucide-react';

const NewScan = () => {
  const [url, setUrl] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [currentScan, setCurrentScan] = useState(null);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: 'Checking security headers' },
    { id: 2, name: 'Scanning for exposed files' },
    { id: 3, name: 'Crawling target site' },
    { id: 4, name: 'Testing XSS vulnerabilities' },
    { id: 5, name: 'Testing SQL injection' },
    { id: 6, name: 'Generating AI report' }
  ];

  const validateUrl = (str) => {
    try {
      const u = new URL(str);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleStartScan = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }

    setIsStarting(true);
    try {
      const scan = await createScan(url);
      setCurrentScan(scan);
      setActiveStep(0);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to start scan');
      setIsStarting(false);
    }
  };

  useEffect(() => {
    let pollInterval;
    let stepInterval;

    if (currentScan && currentScan.status !== 'done' && currentScan.status !== 'failed') {
      // Simulate steps progress over time
      stepInterval = setInterval(() => {
        setActiveStep(prev => {
          if (prev < steps.length - 1) return prev + 1;
          return prev;
        });
      }, 2500);

      pollInterval = setInterval(async () => {
        try {
          const updatedScan = await getScan(currentScan.id);
          setCurrentScan(updatedScan);
          if (updatedScan.status === 'done') {
            clearInterval(pollInterval);
            clearInterval(stepInterval);
            setActiveStep(steps.length); // All steps completed
            setTimeout(() => navigate(`/scan/${updatedScan.id}`), 500);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 1500);
    }
    return () => {
      clearInterval(pollInterval);
      clearInterval(stepInterval);
    };
  }, [currentScan, navigate, steps.length]);

  return (
    <div className="max-w-[1600px] mx-auto p-12 min-h-[calc(100vh-64px)] flex items-center justify-center">
      {!currentScan ? (
        <div className="w-full max-w-2xl">
          <div className="bg-card border border-border rounded-3xl p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 opacity-30"></div>
            
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-[0_0_40px_rgba(0,255,136,0.15)] group-hover:scale-110 transition-transform">
                <Shield size={40} />
              </div>
              <h1 className="text-4xl font-bold mb-3 tracking-tight">Start New Security Scan</h1>
              <p className="text-gray-500 text-lg">Enter a URL to perform a comprehensive security audit.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-500 text-sm items-center">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleStartScan} className="space-y-6">
              <div className="relative group/input">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors" size={24} />
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl py-6 pl-16 pr-6 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-xl font-medium"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-widest px-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00ff88]"></div>
                  Free tier: 15 scans per day
                </div>
                <div>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              </div>

              <button
                disabled={isStarting}
                className="w-full bg-primary text-black font-black text-lg py-6 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,136,0.3)]"
              >
                {isStarting ? <Loader2 className="animate-spin" /> : <><Search size={22} /> Start Security Scan</>}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl text-center">
          <div className="mb-12 relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,255,136,0.2)]">
              <Loader2 size={40} className="animate-spin" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-2 text-white">Scanning in progress...</h2>
          <p className="text-gray-500 font-mono text-sm mb-8 truncate max-w-lg mx-auto">{currentScan.target_url}</p>

          <div className="max-w-md mx-auto mb-12">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-primary">
              <span>Security Assessment</span>
              <span>{Math.min(100, Math.round(((activeStep) / steps.length) * 100))}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-primary shadow-[0_0_15px_#00ff88] transition-all duration-1000 ease-out"
                 style={{ width: `${Math.min(100, ((activeStep) / steps.length) * 100)}%` }}
               ></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 text-left space-y-4">
            {steps.map((step, index) => {
              const isCompleted = activeStep > index || currentScan.status === 'done';
              const isActive = activeStep === index && currentScan.status !== 'done';
              
              return (
                <div key={step.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  isCompleted ? 'bg-primary/5 border-primary/20 text-primary shadow-[0_0_15px_rgba(0,255,136,0.05)]' : 
                  isActive ? 'bg-white/5 border-white/10 text-white shadow-xl' : 
                  'bg-transparent border-transparent text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-primary shrink-0" />
                  ) : isActive ? (
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
                      <Loader2 size={20} className="text-primary animate-spin shrink-0 relative" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current shrink-0 opacity-20" />
                  )}
                  <span className={`font-bold ${isActive ? 'text-white' : ''}`}>{step.name}</span>
                  {isActive && (
                    <div className="ml-auto flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest animate-pulse text-primary">Active</span>
                    </div>
                  )}
                  {isCompleted && (
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-primary/40">Verified</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            {currentScan.status === 'done' ? (
              <div className="flex gap-4 w-full justify-center">
                <div className="px-10 py-4 bg-primary/10 text-primary font-bold rounded-xl border border-primary/20 animate-pulse">
                  Finalizing report...
                </div>
              </div>
            ) : (
              <div className="text-gray-600 text-sm flex items-center justify-center gap-2">
                <Info size={14} />
                Average scan time: 30-60 seconds
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewScan;
