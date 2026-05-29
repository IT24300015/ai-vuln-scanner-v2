import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Brain, ArrowLeft, ExternalLink, Globe, Code, Clock, Info, CheckCircle } from 'lucide-react';
import { getScan } from '../services/api';

const ScanResults = () => {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const data = await getScan(id);
        setScan(data);
      } catch {
        console.error('Failed to fetch scan results');
      } finally {
        setLoading(false);
      }
    };
    fetchScan(id);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!scan) return <div>Scan not found</div>;

  const hasCritical = scan.vulnerabilities?.some(v => v.severity === 'critical');
  const hasHigh = scan.vulnerabilities?.some(v => v.severity === 'high');
  const hasMedium = scan.vulnerabilities?.some(v => v.severity === 'medium');
  const hasLow = scan.vulnerabilities?.some(v => v.severity === 'low');

  const getRiskLevel = () => {
    if (hasCritical) return { label: 'CRITICAL RISK', color: 'bg-red-500', text: 'text-red-500' };
    if (hasHigh) return { label: 'HIGH RISK', color: 'bg-orange-500', text: 'text-orange-500' };
    if (hasMedium) return { label: 'MEDIUM RISK', color: 'bg-yellow-500', text: 'text-yellow-500' };
    if (hasLow) return { label: 'LOW RISK', color: 'bg-blue-500', text: 'text-blue-500' };
    return { label: 'SECURE', color: 'bg-green-500', text: 'text-green-500' };
  };

  const risk = getRiskLevel();

  return (
    <div className="p-6 sm:p-12 max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Header Card */}
      <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 ${risk.color} opacity-5 blur-[100px] -mr-32 -mt-32`}></div>
        
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div className="space-y-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-primary" />
              <h1 className="text-2xl  font-bold break-all">{scan.target_url}</h1>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-4 h-4" /> {new Date(scan.created_at).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-4 h-4" /> {scan.vulnerabilities?.length || 0} Risk Vectors Synthesized
              </div>
            </div>
          </div>

          <div className="space-y-4 min-w-[300px]">
            <div className={`p-6 rounded-2xl border ${risk.color}/20 bg-${risk.color}/10 text-center`}>
              <div className={`text-4xl font-black mb-1 ${risk.text}`}>{risk.label}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Strategic Threat Status</div>
            </div>
            <div className="flex gap-3">
              <Link to={`/scan/${id}/report`} className="flex-1 bg-primary text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all">
                <Brain className="w-4 h-4" /> Synthesize Intelligence
              </Link>
              <button className="px-4 py-3 border border-border hover:bg-white/5 rounded-xl transition-colors">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities List */}
      <div className="space-y-12">
        {(scan.vulnerabilities || []).length > 0 ? (
          ['critical', 'high', 'medium', 'low'].map(severity => {
            const items = (scan.vulnerabilities || []).filter(v => v.severity === severity);
            if (items.length === 0) return null;

            const sevColor = severity === 'critical' ? 'text-red-500' : severity === 'high' ? 'text-orange-500' : severity === 'medium' ? 'text-yellow-500' : 'text-blue-500';
            const sevBg = severity === 'critical' ? 'bg-red-500/10' : severity === 'high' ? 'bg-orange-500/10' : severity === 'medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10';
            const sevBorder = severity === 'critical' ? 'border-red-500/20' : severity === 'high' ? 'border-orange-500/20' : severity === 'medium' ? 'border-yellow-500/20' : 'border-blue-500/20';

            return (
              <div key={severity} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-1.5 rounded-full ${sevBg} ${sevBorder} border ${sevColor} text-xs font-black uppercase tracking-[0.2em]`}>
                    {severity} ({items.length})
                  </div>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="grid gap-6">
                  {items.map((vuln, i) => (
                    <div key={i} className="glass p-8 rounded-3xl border-white/5 group hover:border-primary/20 transition-all relative overflow-hidden">
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">{vuln.vuln_type}</h3>
                            <span className="lg:hidden text-xs font-bold text-gray-500">CONFIDENCE: {vuln.confidence_score}%</span>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">{vuln.description}</p>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                              <Globe className="w-3 h-3" /> Affected URL
                            </div>
                            <div className="bg-background/80 p-3 rounded-xl border border-border  text-xs break-all text-primary/80">
                              {vuln.url}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                              <Code className="w-3 h-3" /> Technical Evidence
                            </div>
                            <div className="bg-black/50 p-4 rounded-xl border border-border  text-xs text-blue-300">
                              {vuln.evidence}
                            </div>
                          </div>
                        </div>

                        <div className="lg:w-48 lg:border-l border-border lg:pl-8 space-y-6 flex flex-col justify-center">
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                               <span>Confidence</span>
                               <span>{vuln.confidence_score}%</span>
                             </div>
                             <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border">
                               <div className={`h-full ${sevColor.replace('text', 'bg')} w-[${vuln.confidence_score}%]`} style={{ width: `${vuln.confidence_score}%` }} />
                             </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest opacity-50">
                            <Info className="w-4 h-4" /> OWASP A0{i+1}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass p-20 rounded-3xl border-white/5 text-center">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">No vulnerabilities found!</h2>
            <p className="text-gray-500 text-lg max-w-md mx-auto">Our security assessment did not detect any known vulnerabilities. The target appears to be following security best practices.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanResults;