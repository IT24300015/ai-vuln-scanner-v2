from app.scanners.crawler import Crawler
from app.scanners.headers_scanner import HeadersScanner
from app.scanners.exposed_files_scanner import ExposedFilesScanner
from app.scanners.redirect_scanner import RedirectScanner
from app.scanners.xss_scanner import XSSScanner
from app.scanners.sqli_scanner import SQLiScanner
from app.scanners.base_scanner import ScanResult
from typing import List

class ScanEngine:
    def __init__(self, target_url: str):
        self.target_url = target_url
        self.all_results: List[ScanResult] = []

    def run(self) -> List[ScanResult]:
        print(f"\n{'='*50}")
        print(f"Starting scan of: {self.target_url}")
        print(f"{'='*50}\n")

        # Step 1 — Headers scan
        print("Running Headers Scanner...")
        headers = HeadersScanner(self.target_url)
        self.all_results.extend(headers.scan())

        # Step 2 — Exposed files scan
        print("\nRunning Exposed Files Scanner...")
        exposed = ExposedFilesScanner(self.target_url)
        self.all_results.extend(exposed.scan())

        # Step 3 — Crawl the site
        print("\nCrawling site...")
        crawler = Crawler(self.target_url, max_pages=10)
        pages = crawler.crawl()

        # Step 4 — XSS scan on all pages
        print("\nRunning XSS Scanner...")
        for page in pages:
            xss = XSSScanner(page)
            self.all_results.extend(xss.scan())

        # Step 5 — SQLi scan on all pages
        print("\nRunning SQL Injection Scanner...")
        for page in pages:
            sqli = SQLiScanner(page)
            self.all_results.extend(sqli.scan())

        # Step 6 — Open redirect scan
        print("\nRunning Open Redirect Scanner...")
        redirect = RedirectScanner(self.target_url)
        self.all_results.extend(redirect.scan())

        print(f"\n{'='*50}")
        print(f"Scan Complete!")
        print(f"Total vulnerabilities found: {len(self.all_results)}")
        print(f"{'='*50}\n")

        return self.all_results