from app.scanners.base_scanner import BaseScanner, ScanResult
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs, urlencode, urlunparse
from typing import List

class XSSScanner(BaseScanner):

    # Safe test payloads — these don't actually execute
    XSS_PAYLOADS = [
        "<xss-test>",
        "'\"><xss-test>",
        "<script-test>alert(1)</script-test>",
    ]

    def scan(self) -> List[ScanResult]:
        print(f"[XSS Scanner] Scanning {self.target_url}")

        response = self.get_page(self.target_url)
        if not response:
            return []

        soup = BeautifulSoup(response.text, "html.parser")

        # Test URL parameters
        self._test_url_params(self.target_url)

        # Test forms
        forms = soup.find_all("form")
        for form in forms:
            self._test_form(form, self.target_url)

        print(f"[XSS Scanner] Found {len(self.results)} issues")
        return self.results

    def _test_url_params(self, url: str):
        parsed = urlparse(url)
        params = parse_qs(parsed.query)

        if not params:
            return

        for param in params:
            for payload in self.XSS_PAYLOADS:
                test_params = params.copy()
                test_params[param] = [payload]
                new_query = urlencode(test_params, doseq=True)
                test_url = urlunparse(parsed._replace(query=new_query))

                try:
                    response = self.session.get(test_url, timeout=10)
                    if payload in response.text:
                        self.results.append(ScanResult(
                            vuln_type="Reflected XSS",
                            severity="high",
                            url=test_url,
                            description=f"Reflected XSS found in URL parameter '{param}'",
                            confidence_score=88.0,
                            evidence=f"Payload '{payload}' reflected in response"
                        ))
                        return
                except:
                    continue

    def _test_form(self, form, base_url: str):
        action = form.get("action", "")
        form_url = urljoin(base_url, action) if action else base_url
        inputs = form.find_all("input")

        form_data = {}
        for input_field in inputs:
            name = input_field.get("name", "")
            if name:
                form_data[name] = "test"

        for payload in self.XSS_PAYLOADS:
            test_data = form_data.copy()
            for key in test_data:
                test_data[key] = payload

            try:
                response = self.session.post(form_url, data=test_data, timeout=10)
                if payload in response.text:
                    self.results.append(ScanResult(
                        vuln_type="Reflected XSS",
                        severity="high",
                        url=form_url,
                        description="Reflected XSS found in form input",
                        confidence_score=88.0,
                        evidence=f"Payload '{payload}' reflected in response"
                    ))
                    return
            except:
                continue