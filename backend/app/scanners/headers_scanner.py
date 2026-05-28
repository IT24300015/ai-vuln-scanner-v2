from app.scanners.base_scanner import BaseScanner, ScanResult
from typing import List

class HeadersScanner(BaseScanner):

    # Headers that should be present for security
    REQUIRED_HEADERS = {
        "X-Frame-Options": {
            "severity": "medium",
            "description": "Missing X-Frame-Options header. Site may be vulnerable to clickjacking attacks.",
        },
        "X-Content-Type-Options": {
            "severity": "low",
            "description": "Missing X-Content-Type-Options header. Browser may perform MIME sniffing.",
        },
        "X-XSS-Protection": {
            "severity": "low",
            "description": "Missing X-XSS-Protection header. Browser XSS filter may not be enabled.",
        },
        "Strict-Transport-Security": {
            "severity": "high",
            "description": "Missing HSTS header. Site does not enforce HTTPS connections.",
        },
        "Content-Security-Policy": {
            "severity": "high",
            "description": "Missing Content-Security-Policy header. Site is vulnerable to XSS and injection attacks.",
        },
        "Referrer-Policy": {
            "severity": "low",
            "description": "Missing Referrer-Policy header. Sensitive URLs may be leaked to third parties.",
        },
    }

    def scan(self) -> List[ScanResult]:
        print(f"[Headers Scanner] Scanning {self.target_url}")
        response = self.get_page(self.target_url)

        if not response:
            return []

        headers = response.headers

        for header_name, info in self.REQUIRED_HEADERS.items():
            if header_name not in headers:
                result = ScanResult(
                    vuln_type="Missing Security Header",
                    severity=info["severity"],
                    url=self.target_url,
                    description=f"Missing header: {header_name}. {info['description']}",
                    confidence_score=95.0,
                    evidence=f"Header '{header_name}' not found in response"
                )
                self.results.append(result)
                print(f"  [FOUND] Missing header: {header_name}")

        print(f"[Headers Scanner] Found {len(self.results)} issues")
        return self.results