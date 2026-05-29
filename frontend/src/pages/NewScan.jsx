import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, Search, Loader2, CheckCircle, Circle, AlertCircle, Terminal } from 'lucide-react';
import { createScan, getScan } from '../services/api';

const NewScan = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, scanning, done, error
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [scanId, setScanId] = useState(null);
  const navigate = useNavigate();

  const steps = [
    "Evaluating cryptographic headers and SSL/TLS posture",
    "Auditing infrastructure for exposed metadata and files",
    "Conducting deep-crawler endpoint discovery",
    "Analyzing input vectors for XSS payload injection",
    "Testing database interfaces for SQLi persistence",
    "Synthesizing multi-modal AI intelligence report"
  ];

  const validateUrl = (str) => {
    return str.startsWith('http://') || str.startsWith('https://');
  };

  const getErrorMessage = (err) => {
    const detail = err.response?.data?.detail;

    if (typeof detail === 'string') {
      return detail;
    }

    if (detail?.message) {
      return detail.retry_after
        ? `${detail.message} Retry after ${new Date(detail.retry_after).toLocaleString()}.`
        : detail.message;
    }

    return 'Failed to start scan. Please try again.';
  };

  const handleStartScan = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateUrl(url)) {
      setError('URL must start with http:// or https://');
      return;
    }

    try {
      setStatus('scanning');
      const scan = await createScan(url);
      setScanId(scan.id);
    } catch (err) {
      setStatus('idle');
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    let pollInterval;

    if (status === 'scanning' && scanId) {
      pollInterval = setInterval(async () => {
        try {
          const scan = await getScan(scanId);
          
          if (scan.status === 'done') {
            setCurrentStep(6);
            clearInterval(pollInterval);
            setTimeout(() => navigate(`/scan/${scanId}`), 1000);
          } else if (scan.status === 'running') {
            // Estimate step based on time or something for effect
            // In a real app, backend would return current task
            setCurrentStep(prev => Math.min(prev + 1, 5));
          } else if (scan.status === 'failed') {
            setStatus('error');
            setError('The security scan failed to complete.');
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 3000);
    }

    return () => clearInterval(pollInterval);
  }, [status, scanId, navigate]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 mb-8 glow relative">
            <Shield className={`w-12 h-12 text-primary ${status === 'scanning' ? 'animate-pulse' : ''}`} />
            {status === 'scanning' && (
              <div className="absolute inset-0 rounded-3xl border-2 border-primary animate-ping"></div>
            )}
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {status === 'scanning' ? 'Intelligence Acquisition in Progress' : 'New Security Assessment'}
          </h1>
          <p className="text-gray-500">
            {status === 'scanning' 
              ? 'Our autonomous intelligence engine is currently synthesizing architectural telemetries.' 
              : 'Specify a target domain to begin a high-fidelity vulnerability assessment cycle.'
            }
          </p>
        </div>

        {status === 'idle' ? (
          <div className="glass p-10 rounded-3xl border-primary/10 shadow-2xl">
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleStartScan} className="space-y-8">
              <div>
                <label className="block text-sm font-black text-gray-500 mb-3 ml-1 uppercase tracking-widest">Target Domain / URL</label>
                <div className="relative group">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-background/50 border border-border rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-white text-lg  placeholder:text-gray-700"
                    placeholder="https://enterprise.acme.com"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-primary">Free Plan Guardrail</div>
                  <p className="text-xs text-primary/70">Free users can run 10 scans per 24 hours. After the limit resets, you can retry automatically.</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] active:scale-95 transition-all text-lg"
              >
                <Search className="w-6 h-6" />
                RUN SECURITY SCAN
              </button>
            </form>
          </div>
        ) : (
          <div className="glass p-10 rounded-3xl border-primary/10">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${isCompleted ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted ? 'bg-primary text-black' : 
                      isCurrent ? 'border-2 border-primary text-primary animate-pulse' : 
                      'border-2 border-border text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                       isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                       <Circle className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className={`font-bold ${isCurrent ? 'text-primary' : 'text-white'}`}>{step}</span>
                      {isCurrent && <div className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1">Status: Running</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            {status === 'error' && (
              <div className="mt-12 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <div className="flex items-center gap-3 text-red-500 mb-4 font-bold">
                  <AlertCircle className="w-6 h-6" /> Authentication Failure or Timeout
                </div>
                <p className="text-gray-400 text-sm mb-6">{error}</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="w-full py-3 bg-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500/30 transition-colors"
                >
                  Return to Configuration
                </button>
              </div>
            )}

            <div className="mt-12 bg-black/40 border border-border rounded-xl p-4  text-[11px] text-gray-500 max-h-32 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2 text-primary opacity-60">
                <Terminal className="w-3 h-3" /> SECURITY_ENGINE_OUTPUT
              </div>
              <p>[INFO] Initializing scan engine version 2.4.1</p>
              <p>[DEBUG] Target protocol: {url.split(':')[0]}</p>
              <p>[INFO] Thread pool initialized with 16 workers</p>
              {currentStep > 0 && <p>[INFO] Step 1 finished: No critical header miss</p>}
              {currentStep > 1 && <p>[WARN] Step 2 finished: Found /backup/config.old</p>}
              {currentStep > 2 && <p>[INFO] Step 3 finished: Crawled 42 endpoints</p>}
              <p className="animate-pulse">{'>'} Processing node analysis...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewScan;