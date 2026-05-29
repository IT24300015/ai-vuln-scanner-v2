from groq import Groq
from app.core.config import settings
from typing import List
from app.scanners.base_scanner import ScanResult

try:
    if settings.GROQ_API_KEY:
        client = Groq(api_key=settings.GROQ_API_KEY)
    else:
        client = None
except Exception:
    client = None

class GeminiService:

    def generate_report(self, target_url: str, vulnerabilities: List[ScanResult]) -> str:
        if not vulnerabilities:
            return self._generate_clean_report(target_url)

        vuln_list = ""
        for i, vuln in enumerate(vulnerabilities, 1):
            vuln_list += f"""
Vulnerability {i}:
- Type: {vuln.vuln_type}
- Severity: {vuln.severity.upper()}
- URL: {vuln.url}
- Description: {vuln.description}
- Evidence: {vuln.evidence}
- Confidence: {vuln.confidence_score}%
"""

        prompt = f"""
You are a cybersecurity expert. Analyze these vulnerabilities found on {target_url}.

VULNERABILITIES FOUND:
{vuln_list}

## EXECUTIVE SUMMARY
## CRITICAL FINDINGS
## DETAILED ANALYSIS
## REMEDIATION STEPS
## PRIORITY ORDER
## OVERALL RISK RATING
"""

        try:
            if client is None:
                return self._local_generate_report(target_url, vulnerabilities)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are an expert cybersecurity analyst."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._local_generate_report(target_url, vulnerabilities)

    def _generate_clean_report(self, target_url: str) -> str:
        try:
            if client is None:
                return f"Scan completed. No vulnerabilities found on {target_url}."
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": f"Write security report for {target_url} with no vulnerabilities found. Under 300 words."}],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Scan completed. No vulnerabilities found on {target_url}."

    def _local_generate_report(self, target_url: str, vulnerabilities: List[ScanResult]) -> str:
        total = len(vulnerabilities)
        sev_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
        for v in vulnerabilities:
            s = (v.severity or "").lower()
            if s in sev_counts:
                sev_counts[s] += 1

        severity_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        sorted_vulns = sorted(vulnerabilities, key=lambda x: severity_order.get((x.severity or "").lower(), 0), reverse=True)

        overall_risk = "CRITICAL" if sev_counts.get("critical", 0) > 0 else (
            "HIGH" if sev_counts.get("high", 0) > 0 else (
                "MEDIUM" if sev_counts.get("medium", 0) > 0 else "LOW"))

        report = [
            "## EXECUTIVE SUMMARY",
            f"Scan completed for {target_url}. {total} vulnerabilities found: {sev_counts.get('critical',0)} critical, {sev_counts.get('high',0)} high, {sev_counts.get('medium',0)} medium, {sev_counts.get('low',0)} low.",
            "",
            "## CRITICAL FINDINGS",
            "\n".join([f"{i+1}. {v.vuln_type} ({v.severity.upper()}) - {v.url}" for i, v in enumerate(sorted_vulns[:5])]) or "None",
            "",
            "## DETAILED ANALYSIS",
            "\n\n".join([f"Vulnerability {i+1}: {v.vuln_type}\nSeverity: {v.severity}\nURL: {v.url}\nDescription: {v.description or 'N/A'}\nEvidence: {v.evidence or 'N/A'}" for i, v in enumerate(sorted_vulns)]),
            "",
            "## REMEDIATION STEPS",
            "Apply input validation, output encoding, proper headers, least privilege, and keep libraries updated.",
            "",
            "## PRIORITY ORDER",
            "\n".join([f"{i+1}. {v.vuln_type} ({v.severity})" for i, v in enumerate(sorted_vulns)]),
            "",
            "## OVERALL RISK RATING",
            f"{overall_risk} - Based on the most severe findings detected.",
        ]
        return "\n\n".join(report)


gemini_service = GeminiService()
