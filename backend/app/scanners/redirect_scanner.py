from app.scanners.base_scanner import BaseScanner, ScanResult
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs, urlencode, urlunparse
from typing import List

class RedirectScanner(BaseScanner):

    # Common redirect parameters
    REDIRECT_PARAMS = [
        "next", "url", "redirect", "redirect_url",
        "return", "return_url", "goto", "target",
        "redir", "destination", "link", "forward"
    ]

    TEST_URL = "https://evil.com"

    def scan(self) -> List[ScanResult]:
        print(f"[Redirect Scanner] Scanning {self.target_url}")

        response = self.get_page(self.target_url)
        if not response:
            return []

        # Find all links with redirect parameters
        soup = BeautifulSoup(response.text, "html.parser")
        links = soup.find_all("a", href=True)

        for link in links:
            href = link["href"]
            full_url = urljoin(self.target_url, href)
            parsed = urlparse(full_url)
            params = parse_qs(parsed.query)

            for param in self.REDIRECT_PARAMS:
                if param in params:
                    # Test if we can redirect to external site
                    test_result = self._test_redirect(full_url, param, parsed)
                    if test_result:
                        self.results.append(test_result)

        print(f"[Redirect Scanner] Found {len(self.results)} issues")
        return self.results

    def _test_redirect(self, url, param, parsed) -> ScanResult:
        try:
            params = parse_qs(parsed.query)
            params[param] = [self.TEST_URL]
            new_query = urlencode(params, doseq=True)
            test_url = urlunparse(parsed._replace(query=new_query))

            response = self.session.get(
                test_url, timeout=10, allow_redirects=False
            )

            # Check if it redirects to our test URL
            if response.status_code in [301, 302, 303, 307, 308]:
                location = response.headers.get("Location", "")
                if "evil.com" in location:
                    return ScanResult(
                        vuln_type="Open Redirect",
                        severity="medium",
                        url=test_url,
                        description=f"Open redirect found via parameter '{param}'",
                        confidence_score=85.0,
                        evidence=f"Redirect to {location} when {param}={self.TEST_URL}"
                    )
        except:
            pass
        return None