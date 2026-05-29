import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Zap, ArrowRight, CheckCircle, Mail, Phone, MapPin, Globe, Lock, Cpu, Database } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const threatData = [
  { name: 'XSS', value: 34, color: '#00ff88' },
  { name: 'SQLi', value: 28, color: '#00ff88' },
  { name: 'Broken Auth', value: 22, color: '#00ff88' },
  { name: 'Misconfig', value: 18, color: '#00ff88' },
  { name: 'Broken Access', value: 15, color: '#00ff88' },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black">
      {/* Grid Background Effect */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#00ff88 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border bg-background/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-primary w-8 h-8" />
            <span className="text-2xl font-bold tracking-tighter">VulnScanner <span className="text-primary">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2 text-sm font-medium hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="px-6 py-2 bg-primary text-black text-sm font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Enterprise Security Platform
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
              Secure Your <br />
              <span className="text-primary underline decoration-primary/30 underline-offset-8">Digital Assets.</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Next-generation vulnerability scanning powered by Google Gemini AI. 
              Identify, analyze, and remediate security threats before they're exploited.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="group px-8 py-4 bg-primary text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all">
                Start Free Scan <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 border border-border hover:border-primary/50 rounded-xl font-bold transition-all">
                View Demo
              </button>
            </div>

            <div className="pt-8 border-t border-border grid grid-cols-3 gap-8">
              <div>
                <div className="text-2xl font-bold">1K+</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Scans Run</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Experts</div>
              </div>
            </div>
          </div>

          {/* Mock Dashboard Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-card border border-border rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="px-3 py-1 rounded-md bg-background border border-border text-[10px] text-gray-400">
                  SCAN STATUS: <span className="text-primary font-bold">ACTIVE</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-background border border-border rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Compliance</div>
                  <div className="text-lg font-bold">OWASP Top 10</div>
                </div>
                <div className="p-4 bg-background border border-border rounded-xl">
                  <div className="text-[10px] text-gray-500 uppercase mb-1">Model</div>
                  <div className="text-lg font-bold">Gemini 1.5</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs text-gray-400">Scanning Efficiency</span>
                  <span className="text-xs text-primary font-bold">94%</span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-primary w-[94%]" />
                </div>
                
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-semibold">SQL Injection Detected</span>
                  </div>
                  <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded">HIGH RISK</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-card/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-4">Built for Speed, Clarity & Trust</h2>
            <p className="text-gray-400 mb-16 max-w-2xl mx-auto">
              Our platform combines traditional security testing with advanced AI logic to deliver 
              unparalleled vulnerability detection.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { title: "Automated Scanning", icon: <Shield />, desc: "Continuous security testing across your entire web surface with zero manual effort." },
                { title: "AI-Guided Reporting", icon: <Brain />, desc: "Context-aware vulnerability analysis that explains risks in plain language using AI." },
                { title: "Lightning Workflow", icon: <Zap />, desc: "Go from target URL to detailed security report in under 60 seconds." }
              ].map((f, i) => (
                <div key={i} className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
            <div>
              <h2 className="text-4xl font-bold mb-12">Security Simplified in 3 Steps</h2>
              <div className="space-y-8">
                {[
                  { n: "01", t: "Define Target", d: "Enter your web application URL and configure scan depth. Our system supports single-page apps, legacy systems, and modern APIs." },
                  { n: "02", t: "AI Analysis", d: "Our engine scans for threats while Gemini AI evaluates the impact. It uses heuristic patterns to identify zero-day vulnerabilities." },
                  { n: "03", t: "Instant Report", d: "Get a comprehensive PDF report with actionable remediation steps, code snippets, and severity ratings." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6 group">
                    <span className="text-4xl font-black text-border group-hover:text-primary transition-colors">{s.n}</span>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{s.t}</h4>
                      <p className="text-gray-500">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary p-12 rounded-3xl text-black">
              <h3 className="text-3xl font-bold mb-6">Ready to secure your project?</h3>
              <p className="text-black/70 mb-8 font-medium">Join 50+ developers who trust VulnScanner AI for their security audits.</p>
              <Link to="/register" className="inline-flex px-8 py-4 bg-black text-primary font-bold rounded-xl hover:bg-black/90 transition-all">
                Get Started Free
              </Link>
            </div>
          </div>

          {/* Extra Details & Global Threats */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card border border-border p-8 rounded-3xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Global Threat Landscape</h3>
                  <p className="text-gray-500 text-sm">Most frequent vulnerabilities detected in 2024 (%)</p>
                </div>
                <Globe className="text-primary animate-pulse" />
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {threatData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Lock className="w-5 h-5" />, title: "Zero Trust Architecture", desc: "Our methodology assumes no perimeter trust, scanning internal endpoints." },
                { icon: <Cpu className="w-5 h-5" />, title: "AI-Powered Logic", desc: "Uses Large Language Models to simulate real attacker behavior and payloads." },
                { icon: <Database className="w-5 h-5" />, title: "Continuous Compliance", desc: "Mapping findings directly to SOC2, HIPAA, and GDPR security requirements." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all">
                  <div className="text-primary mb-3">{item.icon}</div>
                  <h4 className="font-bold mb-1 text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-card border border-border flex flex-col items-center text-center hover:border-primary transition-colors">
                <Mail className="text-primary w-8 h-8 mb-4" />
                <h4 className="font-bold mb-2">Email Us</h4>
                <p className="text-gray-500 text-sm">support@vulnscanner.ai</p>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-border flex flex-col items-center text-center hover:border-primary transition-colors">
                <Phone className="text-primary w-8 h-8 mb-4" />
                <h4 className="font-bold mb-2">Call Us</h4>
                <p className="text-gray-500 text-sm">+112 0762 86</p>
              </div>
              <div className="p-8 rounded-2xl bg-card border border-border flex flex-col items-center text-center hover:border-primary transition-colors">
                <MapPin className="text-primary w-8 h-8 mb-4" />
                <h4 className="font-bold mb-2">Location</h4>
                <p className="text-gray-500 text-sm">Cyber solution, Sri Lanka</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale brightness-200 opacity-50">
            <Shield className="w-5 h-5" />
            <span className="font-bold tracking-tighter">VulnScanner AI</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>

          <div className="text-gray-500 text-sm">
            © 2024 VulnScanner AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
