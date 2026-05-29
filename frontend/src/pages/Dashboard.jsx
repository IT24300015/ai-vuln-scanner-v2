import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Shield, Activity, AlertTriangle, CheckCircle, Search, Clock, FolderOpen } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getScans } from '../services/api';

const Dashboard = () => {
  const location = useLocation();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEntryTransition, setShowEntryTransition] = useState(() => Boolean(location.state?.fromLogin));
  const [stats, setStats] = useState({
    totalScans: 0,
    totalVulns: 0,
    critical: 0,
    completed: 0
  });

  useEffect(() => {
    let timer;

    if (showEntryTransition) {
      timer = window.setTimeout(() => setShowEntryTransition(false), 1500);
    }

    const fetchScans = async () => {
      try {
        const data = await getScans();
        setScans(data);
        
        const completed = data.filter(s => s.status === 'done');
        let totalVulns = 0;
        let critical = 0;
        
        data.forEach(scan => {
          const vulns = scan.vulnerabilities || [];
          totalVulns += vulns.length;
          critical += vulns.filter(v => v.severity === 'critical').length;
        });

        setStats({
          totalScans: data.length,
          totalVulns,
          critical,
          completed: completed.length
        });
      } catch {
        console.error('Failed to fetch scans');
      } finally {
        setLoading(false);
      }
    };
    fetchScans();

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [location.state, showEntryTransition]);

  const pieData = [
    { name: 'Critical', value: stats.critical, color: '#ef4444' },
    { name: 'High', value: scans.reduce((acc, s) => acc + (s.vulnerabilities || []).filter(v => v.severity === 'high').length, 0), color: '#f97316' },
    { name: 'Medium', value: scans.reduce((acc, s) => acc + (s.vulnerabilities || []).filter(v => v.severity === 'medium').length, 0), color: '#eab308' },
    { name: 'Low', value: scans.reduce((acc, s) => acc + (s.vulnerabilities || []).filter(v => v.severity === 'low').length, 0), color: '#3b82f6' },
  ].filter(d => d.value > 0);

  const vulnTypes = scans.reduce((acc, scan) => {
    (scan.vulnerabilities || []).forEach(v => {
      acc[v.vuln_type] = (acc[v.vuln_type] || 0) + 1;
    });
    return acc;
  }, {});

  const barData = Object.entries(vulnTypes).map(([name, value]) => ({ name, value })).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative p-6 sm:p-12 max-w-7xl mx-auto space-y-8 animate-fade-in overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-105 bg-[radial-gradient(circle_at_top_left,rgba(45,255,155,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%)] pointer-events-none"></div>
      <div className="absolute top-6 right-6 w-72 h-72 rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-float-up"></div>
      <div className={`fixed inset-0 z-40 flex items-center justify-center bg-[#020617] transition-opacity duration-700 ${showEntryTransition ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,255,155,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_26%)]"></div>
        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-6 animate-pop-in">
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-primary/30 bg-primary/10 shadow-[0_0_60px_rgba(45,255,155,0.22)]">
            <span className="absolute inset-0 rounded-full border border-primary/20 animate-success-pulse"></span>
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.35em]">
              <Search className="w-3 h-3" />
              Dashboard Ready
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Secure workspace loaded
            </h2>
            <p className="mt-3 text-gray-400 max-w-sm">
              Your telemetry and scan controls are now available.
            </p>
          </div>
        </div>
      </div>
      <div className={`relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${showEntryTransition ? 'blur-sm scale-[0.99]' : ''} transition-all duration-700`}>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Intelligence Center</h1>
          <p className="text-gray-500 max-w-xl">Autonomous infrastructure security telemetry presented with a darker, more focused command-center layout.</p>
        </div>
        <Link to="/scan/new" className="px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_18px_rgba(45,255,155,0.45)] transition-all">
          <Search className="w-5 h-5" />
          Start New Assessment
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Infrastructure Nodes', val: stats.totalScans, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Identified Risks', val: stats.totalVulns, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Strategic Alerts', val: stats.critical, icon: Shield, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Verified Deployments', val: stats.completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        ].map((stat, i) => (
          <div key={i} className={`glass panel-gradient p-6 rounded-2xl border-white/5 flex items-center gap-4 shadow-lg ${showEntryTransition ? 'animate-[popIn_0.75s_ease-out_both]' : 'animate-pop-in'}`} style={{ animationDelay: `${i * 90}ms` }}>
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className={`glass panel-gradient p-8 rounded-2xl border-white/5 ${showEntryTransition ? 'animate-[popIn_0.9s_ease-out_both]' : 'animate-pop-in'}`}>
          <h3 className="text-lg font-bold mb-8">Severity Distribution</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #263246', borderRadius: '10px', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
                  No data points to visualize
                </div>
            )}
          </div>
        </div>

        <div className={`glass panel-gradient p-8 rounded-2xl border-white/5 ${showEntryTransition ? 'animate-[popIn_0.9s_ease-out_both]' : 'animate-pop-in'}`}>
          <h3 className="text-lg font-bold mb-8">Top Vulnerability Types</h3>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #263246', borderRadius: '10px', color: '#fff' }} />
                  <Bar dataKey="value" fill="#2dff9b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
                  No vulnerabilities detected yet
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className={`glass panel-gradient rounded-2xl border-white/5 overflow-hidden ${showEntryTransition ? 'animate-[popIn_1s_ease-out_both]' : 'animate-pop-in'}`}>
        <div className="p-6 border-b border-border flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Recent Security Scans</h3>
          </div>
          <Link to="/scan/new" className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All Assessments</Link>
        </div>
        
        <div className="overflow-x-auto">
          {scans.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-border">
                  <th className="px-6 py-5">Infrastructure Target</th>
                  <th className="px-6 py-5">Deployment Status</th>
                  <th className="px-6 py-5">Risk Vectors</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-primary transition-colors underline decoration-primary/20 underline-offset-4">{scan.target_url}</span>
                        <span className="text-[10px] text-gray-500 mt-1 uppercase font-medium tracking-widest">Captured {new Date(scan.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {scan.status === 'done' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-black uppercase tracking-widest text-green-500">
                          <CheckCircle className="w-3 h-3" /> VERIFIED
                        </div>
                      ) : scan.status === 'running' ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">
                          <Activity className="w-3 h-3" /> PROCESSING
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-500/10 border border-gray-500/20 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <Clock className="w-3 h-3" /> {scan.status.toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-black ${(scan.vulnerabilities?.length || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {scan.vulnerabilities?.length || 0}
                        </span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Active Risks</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/scan/${scan.id}`}
                          className="px-4 py-2 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all border border-white/5"
                        >
                          Details
                        </Link>
                        <Link 
                          to={`/scan/${scan.id}/report`}
                          className="px-4 py-2 bg-primary/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-black transition-all border border-primary/20"
                        >
                          Report
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-8 h-8 text-gray-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">No scans found</h4>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start your first security assessment to populate this dashboard.</p>
              <Link to="/scan/new" className="px-8 py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all">
                Start Scanning
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;