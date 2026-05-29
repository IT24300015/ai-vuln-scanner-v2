import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Brain, FileText, ArrowLeft, Download, ShieldCheck, Target, Calendar, AlertCircle } from 'lucide-react';
import { getScan } from '../services/api';

const Report = () => {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const data = await getScan(id);
        setScan(data);
      } catch {
        console.error('Failed to fetch scan');
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
  }, [id]);

  const insertTestSummary = () => {
    const sample = `### AI Remediative Analysis (Sample)\n\nThe target endpoint shows multiple injection surfaces. Prioritize fixes in this order:\n\n1. Sanitize user input at the server-side (use prepared statements).\n2. Implement Content Security Policy to mitigate XSS.\n3. Harden authentication and rotate keys.\n\nDetailed findings:\n- Reflected XSS in /search parameter.\n- SQLi possibility in POST /login payload when username contains SQL meta-characters.\n\nSuggested fixes:\n- Parameterize DB queries.\n- Escape output in templates.\n- Add rate-limiting and WAF rules as short-term mitigation.`;

    setScan((prev) => ({
      ...prev,
      report: {
        ...(prev?.report || {}),
        ai_summary: sample,
      },
    }));
  };

  const handleExport = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      // Helper: convert Markdown to plain text (simple, safe stripping)
      const markdownToPlain = (md) => {
        if (!md) return '';
        let s = String(md);
        // remove fenced code blocks
        s = s.replace(/```[\s\S]*?```/g, '\n');
        // remove inline code
        s = s.replace(/`([^`]+)`/g, '$1');
        // remove images and keep alt text
        s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
        // links: keep link text
        s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
        // headings
        s = s.replace(/^#{1,6}\s*/gm, '');
        // bold/italic
        s = s.replace(/\*\*(.*?)\*\*/g, '$1');
        s = s.replace(/\*(.*?)\*/g, '$1');
        s = s.replace(/__(.*?)__/g, '$1');
        s = s.replace(/_(.*?)_/g, '$1');
        // blockquotes
        s = s.replace(/^>\s?/gm, '');
        // remove remaining markdown bullets
        s = s.replace(/^[\s]*[-*+]\s+/gm, ' - ');
        // remove HTML tags
        s = s.replace(/<[^>]+>/g, '');
        // collapse multiple blank lines
        s = s.replace(/\n{3,}/g, '\n\n');
        return s.trim();
      };

      // Build the full textual report: header, vuln list, AI summary
      const buildFullText = () => {
        const lines = [];
        lines.push('Architectural Intelligence Synthesis - Vulnerability Report');
        lines.push('='.repeat(80));
        lines.push(`Target: ${scan.target_url || 'N/A'}`);
        lines.push(`Date: ${new Date(scan.created_at).toLocaleString()}`);
        lines.push('');

        const sevOrder = ['critical', 'high', 'medium', 'low'];
        const counts = sevOrder.map(s => `${s.toUpperCase()}: ${(scan.vulnerabilities || []).filter(v=>v.severity===s).length}`);
        lines.push('Summary: ' + counts.join(' | '));
        lines.push('');

        lines.push('Vulnerabilities:');
        if ((scan.vulnerabilities || []).length === 0) {
          lines.push('  None found.');
        } else {
          (scan.vulnerabilities || []).forEach((v, i) => {
            lines.push(`  ${i+1}. [${(v.severity||'unknown').toUpperCase()}] ${v.title || v.name || 'Unnamed vulnerability'}`);
            if (v.description) lines.push('     Description: ' + markdownToPlain(v.description));
            if (v.request) lines.push('     Request: ' + markdownToPlain(v.request));
            if (v.response) lines.push('     Response: ' + markdownToPlain(v.response));
            lines.push('');
          });
        }

        lines.push('AI Remediative Analysis:');
        lines.push('');
        const aiPlain = markdownToPlain(scan.report?.ai_summary || 'No AI summary available.');
        lines.push(aiPlain);

        return lines.join('\n');
      };

      // Render full text into PDF with pagination
      const pdf = new jsPDF('p', 'pt', 'a4');
      const margin = 40;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const usableWidth = pageWidth - margin * 2;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');

      const fullText = buildFullText();
      const wrapped = pdf.splitTextToSize(fullText, usableWidth);
      let y = margin;
      const lineHeight = 14;
      for (let i = 0; i < wrapped.length; i++) {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(wrapped[i], margin, y);
        y += lineHeight;
      }

      pdf.save(`vuln-report-${id}.pdf`);
    } catch (err) {
      console.error('PDF export failed', err);
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!scan) return <div>Scan not found</div>;

  const getCount = (sev) => (scan.vulnerabilities || []).filter(v => v.severity === sev).length;

  return (
    <div id="report-root" className="p-6 sm:p-12 max-w-5xl mx-auto space-y-8 animate-fade-in print:p-0">
      {/* Report Header */}
      <div className="glass p-8 sm:p-12 rounded-3xl border-white/5 space-y-8 print:border-none print:bg-white print:text-black">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-border pb-8 print:border-black/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Architectural Intelligence Synthesis</h1>
              <p className="text-gray-500 text-sm">Synthesized by <span className="text-primary font-bold">VulnScanner AI Intelligence Agent</span></p>
            </div>
          </div>
          
          <div className="flex gap-4 print:hidden">
            <Link to={`/dashboard`} className="px-6 py-3 border border-border text-white font-bold rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Dashboard
            </Link>
            {!scan.report?.ai_summary && (
              <button
                onClick={insertTestSummary}
                className="px-4 py-2 border border-border text-white rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                Insert Test AI Summary
              </button>
            )}
            <button 
              onClick={handleExport}
              className="px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2 hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all"
            >
              <Download className="w-4 h-4" /> Export Report PDF
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-gray-400 font-medium">Endpoint URI:</span>
              <span className=" text-xs">{scan.target_url}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-gray-400 font-medium">Audit Timestamp:</span>
              <span>{new Date(scan.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-gray-400 font-medium">Intelligence Core:</span>
              <span>AU-VULN-CORE v2.4.0</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Critical', val: getCount('critical'), color: 'text-red-500', bg: 'bg-red-500/10' },
              { label: 'High', val: getCount('high'), color: 'text-orange-500', bg: 'bg-orange-500/10' },
              { label: 'Medium', val: getCount('medium'), color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              { label: 'Low', val: getCount('low'), color: 'text-blue-500', bg: 'bg-blue-500/10' },
            ].map((stat, i) => (
              <div key={i} className={`p-4 rounded-2xl ${stat.bg} border border-border/10 text-center`}>
                <div className={`text-2xl font-black ${stat.color}`}>{stat.val}</div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Content */}
      <div className="glass p-8 sm:p-12 rounded-3xl border-white/5 relative print:border-none print:shadow-none">
        <div className="absolute top-8 right-8 print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black">
            <Brain className="w-3.5 h-3.5" /> AI GENERATED ANALYSIS
          </div>
        </div>

        <div id="ai-summary-pdf" className="markdown-content">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold border-none p-0! m-0!">AI Remediative Analysis</h2>
          </div>
          
          {scan.report?.ai_summary ? (
            <div className="markdown-content">
              <ReactMarkdown>
                {scan.report.ai_summary}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="p-12 text-center bg-white/5 rounded-3xl border border-dashed border-border">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No AI report available</h3>
              <p className="text-gray-500">The scan may still be processing or failed to generate an AI assessment.</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs py-12 hidden print:block border-t border-black/10 mt-20">
        Confidential Security Assessment — Produced for Authorized Use Only
      </div>
    </div>
  );
};

export default Report;