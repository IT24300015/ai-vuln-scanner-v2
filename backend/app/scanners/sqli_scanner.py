from app.scanners.base_scanner import BaseScanner, ScanResult
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, parse_qs, urlencode, urlunparse
from typing import List

class SQLiScanner(BaseScanner):

    # Safe error-based payloads
    SQLI_PAYLOADS = ["'", "''", "1=1", "1'1"]

    # Database error messages to look for
    DB_ERRORS = [
        "sql syntax",
        "mysql_fetch",
        "ora-01756",
        "unclosed quotation",
        "sqlstate",
        "pg_query",
        "sqlite_query",
        "syntax error",
        "database error",
        "sql error",
        "mysql error",
        "warning: mysql",
    ]

    def scan(self) -> List[ScanResult]:
        print(f"[SQLi Scanner] Scanning {self.target_url}")

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

        print(f"[SQLi Scanner] Found {len(self.results)} issues")
        return self.results

    def _has_db_error(self, response_text: str) -> bool:
        text_lower = response_text.lower()
        for error in self.DB_ERRORS:
            if error in text_lower:
                return True
        return False

    def _test_url_params(self, url: str):
        parsed = urlparse(url)
        params = parse_qs(parsed.query)

        if not params:
            return

        for param in params:
            for payload in self.SQLI_PAYLOADS:
                test_params = params.copy()
                test_params[param] = [payload]
                new_query = urlencode(test_params, doseq=True)
                test_url = urlunparse(parsed._replace(query=new_query))

                try:
                    response = self.session.get(test_url, timeout=10)
                    if self._has_db_error(response.text):
                        self.results.append(ScanResult(
                            vuln_type="SQL Injection",
                            severity="critical",
                            url=test_url,
                            description=f"SQL Injection found in URL parameter '{param}'",
                            confidence_score=85.0,
                            evidence=f"Database error triggered with payload: {payload}"
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

        for payload in self.SQLI_PAYLOADS:
            test_data = form_data.copy()
            for key in test_data:
                test_data[key] = payload

            try:
                response = self.session.post(form_url, data=test_data, timeout=10)
                if self._has_db_error(response.text):
                    self.results.append(ScanResult(
                        vuln_type="SQL Injection",
                        severity="critical",
                        url=form_url,
                        description="SQL Injection found in form input",
                        confidence_score=85.0,
                        evidence=f"Database error triggered with payload: {payload}"
                    ))
                    return
            except:
                continue