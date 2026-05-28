from google import genai
from app.core.config import settings
from typing import List
from app.scanners.base_scanner import ScanResult

# Configure Gemini
client = genai.Client(api_key=settings.GEMINI_API_KEY)

class GeminiService:

    def generate_report(
        self,
        target_url: str,
        vulnerabilities: List[ScanResult]
    ) -> str:

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
You are a cybersecurity expert. Analyze these vulnerabilities found on {target_url} and provide a detailed security report.

VULNERABILITIES FOUND:
{vuln_list}

Please provide a report with these exact sections:

## EXECUTIVE SUMMARY
Write a 2-3 sentence summary of the overall security posture.

## CRITICAL FINDINGS
List the most dangerous vulnerabilities first with their risk level.

## DETAILED ANALYSIS
For each vulnerability provide:
- What it is
- Why it is dangerous
- How an attacker could exploit it

## REMEDIATION STEPS
For each vulnerability provide specific step-by-step fix instructions.

## PRIORITY ORDER
List vulnerabilities in order of which to fix first (1 = most urgent).

## OVERALL RISK RATING
Give an overall risk rating: CRITICAL / HIGH / MEDIUM / LOW and explain why.

Keep the report professional, technical, and actionable.
"""

        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            return f"Error generating AI report: {str(e)}"

    def _generate_clean_report(self, target_url: str) -> str:
        prompt = f"""
You are a cybersecurity expert. A security scan of {target_url} found no vulnerabilities.

Write a brief professional security report confirming:
1. The scan was completed
2. No critical vulnerabilities were detected
3. General security recommendations
4. Disclaimer that manual testing is still recommended

Keep it under 300 words.
"""
        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text
        except Exception as e:
            return f"Scan completed. No vulnerabilities found on {target_url}."


gemini_service = GeminiService()