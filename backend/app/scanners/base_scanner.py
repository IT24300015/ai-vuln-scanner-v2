from dataclasses import dataclass
from typing import List
import requests

@dataclass
class ScanResult:
    vuln_type: str
    severity: str        # critical / high / medium / low
    url: str
    description: str
    confidence_score: float  # 0.0 to 100.0
    evidence: str

class BaseScanner:
    def __init__(self, target_url: str):
        self.target_url = target_url
        self.results: List[ScanResult] = []
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Security Scanner)"
        })
        self.session.timeout = 10

    def get_page(self, url: str):
        """Fetch a page safely"""
        try:
            response = self.session.get(url, timeout=10, allow_redirects=True)
            return response
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None

    def scan(self) -> List[ScanResult]:
        """Override this in each scanner"""
        raise NotImplementedError