from app.scanners.base_scanner import BaseScanner, ScanResult
from typing import List
from urllib.parse import urljoin

class ExposedFilesScanner(BaseScanner):

    # Common sensitive files to check
    SENSITIVE_PATHS = [
        "/.env",
        "/.git/config",
        "/config.php",
        "/wp-config.php",
        "/phpinfo.php",
        "/admin",
        "/admin/",
        "/administrator",
        "/backup.zip",
        "/backup.sql",
        "/database.sql",
        "/.htaccess",
        "/web.config",
        "/config.yml",
        "/config.yaml",
        "/server-status",
        "/robots.txt",
        "/sitemap.xml",
        "/.DS_Store",
        "/package.json",
        "/composer.json",
    ]

    def scan(self) -> List[ScanResult]:
        print(f"[Exposed Files Scanner] Scanning {self.target_url}")

        for path in self.SENSITIVE_PATHS:
            url = urljoin(self.target_url, path)
            try:
                response = self.session.get(url, timeout=10)

                if response.status_code == 200:
                    # Check if it returned real content
                    if len(response.text) > 0:
                        severity = self._get_severity(path)
                        result = ScanResult(
                            vuln_type="Exposed Sensitive File",
                            severity=severity,
                            url=url,
                            description=f"Sensitive file/directory accessible: {path}",
                            confidence_score=90.0,
                            evidence=f"HTTP 200 response received for {url} ({len(response.text)} bytes)"
                        )
                        self.results.append(result)
                        print(f"  [FOUND] Exposed: {url}")

            except Exception as e:
                continue

        print(f"[Exposed Files Scanner] Found {len(self.results)} issues")
        return self.results

    def _get_severity(self, path: str) -> str:
        critical_paths = ["/.env", "/.git/config", "/config.php",
                         "/wp-config.php", "/backup.sql", "/database.sql"]
        high_paths = ["/phpinfo.php", "/admin", "/administrator",
                     "/backup.zip", "/web.config"]

        if path in critical_paths:
            return "critical"
        elif path in high_paths:
            return "high"
        else:
            return "medium"