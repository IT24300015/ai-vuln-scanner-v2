import { Link } from 'react-router-dom';
import { Shield, Brain, Zap, ArrowRight, Mail, Phone, MapPin, Activity, Award, Globe, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Home = () => {
  const vulnData = [
    { name: 'SQLi', value: 45, color: '#ef4444' },
    { name: 'XSS', value: 38, color: '#f97316' },
    { name: 'Auth', value: 32, color: '#f59e0b' },
    { name: 'SSRF', value: 25, color: '#3b82f6' },
    { name: 'Headers', value: 54, color: '#00ff88' },
  ];

  const trendData = [
    { name: 'Jan', ai: 10, chain: 5, zero: 2 },
    { name: 'Feb', ai: 25, chain: 12, zero: 8 },
    { name: 'Mar', ai: 45, chain: 28, zero: 15 },
    { name: 'Apr', ai: 70, chain: 45, zero: 22 },
    { name: 'May', ai: 110, chain: 65, zero: 38 },
    { name: 'Jun', ai: 142, chain: 88, zero: 45 },
  ];

  const securityChecklist = [
    {
      title: 'HTTPS everywhere',
      desc: 'Force TLS across the app and set HSTS, CSP, X-Frame-Options, and X-Content-Type-Options.'
    },
    {
      title: 'Strong authentication',
      desc: 'Use strong passwords, short-lived tokens, and secure token storage.'
    },
    {
      title: 'Backend rate limits',
      desc: 'Limit login attempts, scan creation, and other API calls at the server layer.'
    },
    {
      title: 'Free-plan quota',
      desc: 'Keep the 10 scans per 24 hours rule enforced on the backend with a retry time.'
    },
    {
      title: 'SSRF defenses',
      desc: 'Block localhost, private IP ranges, metadata IPs, and unsafe redirects before scanning.'
    },
    {
      title: 'Input validation',
      desc: 'Validate and sanitize every input on the backend, even when the frontend checks it first.'
    },
    {
      title: 'Strict authorization',
      desc: 'Ensure users can only access their own scans, reports, and results.'
    },
    {
      title: 'Audit logging',
      desc: 'Log login attempts, scan requests, scan failures, and admin actions for traceability.'
    },
    {
      title: 'CSRF protection',
      desc: 'Add CSRF controls if the app ever moves to cookie-based authentication.'
    },
    {
      title: 'Secret management',
      desc: 'Store API keys and environment secrets outside the repository.'
    },
    {
      title: 'Dependency hygiene',
      desc: 'Keep dependencies updated and scan them regularly for known vulnerabilities.'
    },
    {
      title: 'Worker hardening',
      desc: 'Run background scan jobs with minimal privileges and isolated permissions.'
    },
    {
      title: 'Login cooldowns',
      desc: 'Add lockout or cooldown rules after repeated failed login attempts.'
    },
    {
      title: 'Clear quota errors',
      desc: 'Return explicit API messages so the UI can show when retries are allowed again.'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Home Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <span className="font-bold text-2xl">VulnScanner <span className="text-primary italic">AI</span></span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-gray-400 font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="px-6 py-2 text-primary font-medium hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 sm:px-12 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Enterprise Security Platform
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Secure Your <br />
            <span className="text-primary">Digital Assets.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
            Unleash the power of AI to identify, analyze, and remediate web vulnerabilities before attackers do. Professional grade scanning for modern applications.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="px-8 py-4 bg-primary text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform">
              Start Free Scan <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-transparent border border-border text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
              View Demo
            </button>
          </div>
          
          <div className="mt-12 flex items-center gap-12 border-t border-border pt-12">
            <div>
              <div className="text-3xl font-bold">1K+</div>
              <div className="text-gray-500 text-sm">Scans Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-gray-500 text-sm">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold">60+</div>
              <div className="text-gray-500 text-sm">Security Experts</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 rounded-full"></div>
          <div className="relative glass p-6 rounded-3xl border-primary/20 glow">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="px-3 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                LIVE STATUS: OK
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Compliance', val: 'OWASP 2026', icon: Award },
                { label: 'Accuracy', val: '99.9%', icon: Activity },
                { label: 'Scan Speed', val: '0.4s/req', icon: Zap },
                { label: 'AI Engine', val: 'Gemini 3.5', icon: Brain }
              ].map((stat, i) => (
                <div key={i} className="bg-background/50 p-4 rounded-xl border border-border">
                  <div className="text-gray-500 text-xs mb-1 font-medium">{stat.label}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{stat.val}</span>
                    <stat.icon className="w-4 h-4 text-primary opacity-50" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-medium">Scanning Efficiency</span>
                <span className="text-primary font-bold">94%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden border border-border">
                <div className="h-full bg-primary w-[94%]" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Recent Result</span>
                <span className="px-2 py-0.5 bg-red-500 text-black text-[10px] font-bold rounded">HIGH RISK</span>
              </div>
              <div className="text-sm font-semibold mb-1">CVE-2024-SQL-INJECTION</div>
              <div className="text-xs text-gray-400 font-mono">https://api.target.com/v1/users?id=1' OR '1'='1</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 sm:px-12 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Built for Speed, Clarity & Trust</h2>
            <p className="text-gray-400">Our advanced architecture ensures your applications stay ahead of evolving threats.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Automated Scanning', 
                desc: 'Deep crawl and automated vulnerability detection focusing on OWASP Top 10 security risks.', 
                icon: Shield 
              },
              { 
                title: 'AI-Guided Reporting', 
                desc: 'Get precise remediation steps and vulnerability impact analysis generated by advanced AI models.', 
                icon: Brain 
              },
              { 
                title: 'Instant Workflow', 
                desc: 'Simple, streamlined interface designed for developers and security professionals alike.', 
                icon: Zap 
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl glass hover:border-primary/50 transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-12">Security Simplified.</h2>
            <div className="space-y-12">
              {[
                { n: '01', t: 'Define Target', d: 'Enter your application URL and our engine will begin its discovery process.' },
                { n: '02', t: 'AI Analysis', d: 'AI scrutinizes findings to eliminate false positives and clarify technical risks.' },
                { n: '03', t: 'Instant Report', d: 'Export professional PDF reports with executive summaries and technical fixes.' }
              ].map((s, i) => (
                <div key={i} className="flex gap-6 group hover:translate-x-2 transition-transform cursor-default">
                  <div className="text-5xl font-black text-white/5 group-hover:text-primary/20 transition-colors uppercase">{s.n}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{s.t}</h4>
                    <p className="text-gray-400">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-12 rounded-3xl text-center border-primary/20">
            <Shield className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-bold mb-4">Protect Your Future.</h3>
            <p className="text-gray-400 mb-8">Join thousands of companies securing their infrastructure with VulnScanner AI.</p>
            <Link to="/register" className="inline-block px-10 py-4 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Security Checklist Section */}
      <section id="security" className="py-24 px-6 sm:px-12 bg-card/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="w-4 h-4" /> Security Hardening
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">High-Security Checklist</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A practical checklist for keeping the platform professional, secure, and ready for controlled free-tier usage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {securityChecklist.map((item, index) => (
              <div key={index} className="glass p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Intelligence Section */}
      <section className="py-24 px-6 sm:px-12 bg-card/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Globe className="w-4 h-4" /> Global Intelligence
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Threat Landscape & Trends</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Real-time data visualization of global security threats and AI-predicted attack vectors.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Graph 1: Vulnerability Frequency */}
            <div className="glass rounded-3xl p-8 border-white/5 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 italic">
                    <Activity className="w-5 h-5 text-primary" /> 
                    Matched Vulnerabilities
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">Detection frequency per 10k requests</p>
                </div>
                <div className="text-right">
                  <div className="text-primary font-mono font-bold text-lg">+12%</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">vs last month</div>
                </div>
              </div>

              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vulnData}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: '#111827', 
                        border: '1px solid #1f2937', 
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[6, 6, 0, 0]}
                      fill="#00ff88"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xs text-gray-500 font-bold mb-1 uppercase">Top Threat</div>
                  <div className="text-lg font-bold text-white">Security Headers</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-xs text-gray-500 font-bold mb-1 uppercase">Avg. Severity</div>
                  <div className="text-lg font-bold text-orange-500">High Risk</div>
                </div>
              </div>
            </div>

            {/* Graph 2: Trend Forecast */}
            <div className="glass rounded-3xl p-8 border-white/5 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2 italic">
                    <TrendingUp className="w-5 h-5 text-primary" /> 
                    Global Security Trends
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">AI-predicted threat growth (2026)</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                  Forecast
                </div>
              </div>

              <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#111827', 
                        border: '1px solid #1f2937', 
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ai" 
                      stroke="#00ff88" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorAi)" 
                      name="AI Threats"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="chain" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="transparent" 
                      name="Supply Chain"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">AI-Powered Forecasting</div>
                  <div className="text-xs text-gray-500">Predicted +142% surge in synth-payloads by Q4.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 sm:px-12 bg-card/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Mail, label: 'Email Support', val: 'security@vulnscanner.ai' },
            { icon: Phone, label: 'Phone', val: '+94 112 6286 VULN-AI' },
            { icon: MapPin, label: 'Global HQ', val: 'Cyber Solution, Sri Lanka' }
          ].map((c, i) => (
            <div key={i} className="p-8 rounded-2xl glass hover:border-primary/50 text-center transition-all">
              <c.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="text-sm text-gray-500 mb-1">{c.label}</div>
              <div className="font-bold">{c.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 border-t border-border mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">VulnScanner AI</span>
          </div>
          <div className="flex gap-12 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
          <p className="text-gray-600 text-sm">© 2026 VulnScanner AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;