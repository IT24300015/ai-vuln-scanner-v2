import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getScans } from '../services/api';
import { 
  ShieldAlert, ShieldCheck, Activity, Layers, 
  ArrowUpRight, Info, AlertTriangle, Search, Loader2, Brain
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis 
} from 'recharts';

const Dashboard = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchScans = async () => {
      try {
        const data = await getScans();
        if (isMounted) {
          setScans(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to fetch scans:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchScans();
    return () => { isMounted = false; };
  }, []);

  const stats = {
    totalScans: scans.length,
    vulnerabilities: scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.length || 0), 0),
    critical: scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.filter(v => v.severity === 'critical')?.length || 0), 0),
    completed: scans.filter(s => s.status === 'done').length
  };

  const pieData = [
    { name: 'Critical', value: scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.filter(v => v.severity === 'critical')?.length || 0), 0), color: '#ef4444' },
    { name: 'High', value: scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.filter(v => v.severity === 'high')?.length || 0), 0), color: '#f97316' },
    { name: 'Medium', value: scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.filter(v => v.severity === 'medium')?.length || 0), 0), color: '#eab308' },
    { name: 'Low', value: scans.reduce((acc, scan) => acc + (scan.vulnerabilities?.filter(v => v.severity === 'low')?.length || 0), 0), color: '#3b82f6' },
  ].filter(d => d.value > 0);

  const vulnTypes = {};
  scans.forEach(scan => {
    scan.vulnerabilities?.forEach(v => {
      const type = v.vuln_type || 'Unknown';
      vulnTypes[type] = (vulnTypes[type] || 0) + 1;
    });
  });
  const barData = Object.entries(vulnTypes).map(([name, count]) => ({ name, count }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
        <p className="text-gray-500 font-medium">Decrypting security data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of your infrastructure security.</p>
        </div>
        <Link to="/scan/new" className="px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]">
          <Search size={18} />
          New Scan
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Scans', val: stats.totalScans, icon: <Layers />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Vulnerabilities', val: stats.vulnerabilities, icon: <ShieldAlert />, color: 'text-red-500', bg: 'bg-red-500/10' },
          { label: 'Critical Issues', val: stats.critical, icon: <AlertTriangle />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Completed', val: stats.completed, icon: <ShieldCheck />, color: 'text-primary', bg: 'bg-primary/10' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-2xl hover:border-border/80 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                {s.icon}
              </div>
              <Activity size={16} className="text-gray-700" />
            </div>
            <div className="text-3xl font-bold mb-1">{s.val}</div>
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-card border border-border p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-8">Severity Distribution</h3>
          <div className="h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-600 italic">No vulnerability data yet</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border p-8 rounded-3xl">
          <h3 className="text-lg font-bold mb-8">Vulnerability Types</h3>
          <div className="h-[300px]">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                    itemStyle={{ color: '#00ff88' }}
                  />
                  <Bar dataKey="count" fill="#00ff88" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 italic">No scan results found</div>
            )}
          </div>
        </div>
      </div>

      {/* Scans Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex justify-between items-center bg-white/[0.02]">
          <h3 className="font-bold">Recent Scans</h3>
          <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-border rounded-lg">{scans.length} Total</span>
        </div>
        <div className="overflow-x-auto">
          {scans.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-widest bg-white/[0.01]">
                  <th className="px-8 py-5 font-semibold">Target URL</th>
                  <th className="px-8 py-5 font-semibold">Status</th>
                  <th className="px-8 py-5 font-semibold">Vulnerabilities</th>
                  <th className="px-8 py-5 font-semibold">Date</th>
                  <th className="px-8 py-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {scans.map((scan) => (
                  <tr key={scan.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5 font-mono text-sm text-gray-300 max-w-xs truncate">{scan.target_url}</td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        scan.status === 'done' ? 'bg-primary/10 text-primary' : 
                        scan.status === 'running' ? 'bg-blue-500/10 text-blue-500' : 
                        scan.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {scan.status === 'running' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>}
                        {scan.status}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-1.5">
                        {['critical', 'high', 'medium', 'low'].map(sev => {
                          const count = scan.vulnerabilities?.filter(v => v.severity === sev)?.length || 0;
                          if (count === 0) return null;
                          const colors = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-blue-500' };
                          return (
                            <span key={sev} className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-black ${colors[sev]}`} title={`${sev}: ${count}`}>
                              {count}
                            </span>
                          );
                        })}
                        {(!scan.vulnerabilities || scan.vulnerabilities.length === 0) && scan.status === 'done' && (
                          <span className="text-xs text-gray-600 font-medium">None found</span>
                        )}
                        {scan.status !== 'done' && <span className="text-xs text-gray-600 italic">Pending...</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-5 text-right flex items-center justify-end gap-3">
                      {scan.status === 'done' ? (
                        <>
                          <Link 
                            to={`/scan/${scan.id}/report`} 
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
                          >
                            <Brain size={12} /> Report
                          </Link>
                          <Link 
                            to={`/scan/${scan.id}`} 
                            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                          >
                            Details <ArrowUpRight size={12} />
                          </Link>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-gray-600 italic">
                          <Loader2 size={12} className="animate-spin" /> Processing...
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-border flex items-center justify-center text-gray-600">
                <ShieldAlert size={32} />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-lg mb-1">No Scans Found</h4>
                <p className="text-gray-500 text-sm mb-6">Start your first security audit with VulnScanner AI.</p>
                <Link to="/scan/new" className="px-6 py-2.5 bg-primary text-black font-bold rounded-lg hover:scale-105 transition-all">
                  Start Scanning
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
