import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getScan } from '../services/api';
import { 
  Shield, Brain, LayoutDashboard, Calendar, Globe, 
  AlertTriangle, ChevronRight, CheckCircle2, Loader2, Info, Search
} from 'lucide-react';

const ScanResults = () => {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const data = await getScan(id);
        setScan(data);
      } catch (error) {
        console.error('Failed to fetch scan:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-gray-500">Analyzing scan data...</p>
    </div>
  );

  if (!scan) return <div className="p-12 text-center">Scan not found</div>;

  const getRiskLevel = () => {
    const severities = scan.vulnerabilities?.map(v => v.severity) || [];
    if (severities.includes('critical')) return { label: 'CRITICAL RISK', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    if (severities.includes('high')) return { label: 'HIGH RISK', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
    if (severities.includes('medium')) return { label: 'MEDIUM RISK', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    if (severities.includes('low')) return { label: 'LOW RISK', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    return { label: 'SECURE', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' };
  };

  const risk = getRiskLevel();
  const groupedVulns = scan.vulnerabilities?.reduce((acc, v) => {
    acc[v.severity] = [...(acc[v.severity] || []), v];
    return acc;
  }, {}) || {};

  return (
    <div className="max-w-[1400px] mx-auto p-8 pb-20">
      {/* Header Card */}
      <div className="bg-card border border-border rounded-3xl p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-border text-gray-400">
                <Globe size={20} />
              </div>
              <h1 className="text-2xl font-mono font-bold text-gray-100">{scan.target_url}</h1>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(scan.created_at).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} />
                ID: {String(scan.id).substring(0, 8)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${risk.color}`}>Overall Status</div>
              <div className={`px-4 py-2 rounded-xl border-2 font-black text-lg ${risk.bg} ${risk.color} ${risk.border} shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                {risk.label}
              </div>
            </div>
            
            <div className="text-right border-l border-border pl-8">
              <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-gray-500">Security Threats</div>
              <div className="text-3xl font-black text-white">{scan.vulnerabilities?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
          <Link to={`/scan/${scan.id}/report`} className="px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]">
            <Brain size={18} />
            View AI Report
          </Link>
          <Link to="/scan/new" className="px-6 py-3 border border-border text-gray-300 hover:text-white hover:bg-white/5 font-bold rounded-xl flex items-center gap-2 transition-all">
            <Search size={18} />
            Start New Scan
          </Link>
          <Link to="/dashboard" className="px-6 py-3 border border-border text-gray-300 hover:text-white hover:bg-white/5 font-bold rounded-xl flex items-center gap-2 transition-all">
            <LayoutDashboard size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-12">
        {scan.vulnerabilities?.length > 0 ? (
          ['critical', 'high', 'medium', 'low'].map(severity => {
            const vulns = groupedVulns[severity];
            if (!vulns) return null;

            const severityStyles = {
              critical: { badge: 'bg-red-500', text: 'text-red-500', border: 'border-red-500/20' },
              high: { badge: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500/20' },
              medium: { badge: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500/20' },
              low: { badge: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500/20' }
            };

            return (
              <div key={severity} className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-md text-black font-black text-[10px] uppercase tracking-wider ${severityStyles[severity].badge}`}>
                    {severity}
                  </span>
                  <span className="text-gray-500 font-bold">{vulns.length} Issues Detected</span>
                  <div className="h-px bg-border flex-1"></div>
                </div>

                <div className="grid gap-6">
                  {vulns.map((v, i) => (
                    <div key={i} className={`bg-card border ${severityStyles[severity].border} rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all group`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold group-hover:text-white transition-colors capitalize">
                            {(v.vuln_type || 'Unknown').replace(/_/g, ' ')}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="text-right">
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1">Confidence Score</div>
                              <div className="w-24 h-1.5 bg-background border border-border rounded-full overflow-hidden">
                                <div className={`h-full ${severityStyles[severity].badge}`} style={{ width: `${v.confidence_score * 100}%` }}></div>
                              </div>
                              <div className="text-[10px] font-bold text-gray-400 mt-1">{(v.confidence_score * 100).toFixed(0)}%</div>
                           </div>
                        </div>
                      </div>

                      <p className="text-gray-400 mb-6 leading-relaxed max-w-4xl">{v.description}</p>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <Globe size={10} /> Impacted URL
                          </div>
                          <div className="bg-background border border-border p-3 rounded-lg font-mono text-sm text-primary/80 overflow-x-auto">
                            {v.url}
                          </div>
                        </div>

                        {v.evidence && (
                          <div className="space-y-2">
                             <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <Info size={10} /> Evidence
                            </div>
                            <div className="bg-background/80 border border-border p-4 rounded-xl font-mono text-xs text-blue-400/90 whitespace-pre-wrap">
                              {v.evidence}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-[0_0_40px_rgba(0,255,136,0.1)]">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-bold mb-2">No Vulnerabilities Found!</h2>
            <p className="text-gray-500 max-w-md">Your target appears to be secure based on our current security definitions and AI logic. Keep up the good work!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanResults;
