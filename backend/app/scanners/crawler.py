import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Set, List

class Crawler:
    def __init__(self, target_url: str, max_pages: int = 20):
        self.target_url = target_url
        self.max_pages = max_pages
        self.visited: Set[str] = set()
        self.to_visit: List[str] = [target_url]
        self.domain = urlparse(target_url).netloc
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Security Scanner)"
        })

    def crawl(self) -> List[str]:
        """Crawl the target site and return all found URLs"""
        print(f"Starting crawl of {self.target_url}")

        while self.to_visit and len(self.visited) < self.max_pages:
            url = self.to_visit.pop(0)

            if url in self.visited:
                continue

            try:
                response = self.session.get(url, timeout=10)
                self.visited.add(url)
                print(f"Crawled: {url}")

                # Parse links from page
                soup = BeautifulSoup(response.text, "html.parser")
                for link in soup.find_all("a", href=True):
                    full_url = urljoin(url, link["href"])
                    parsed = urlparse(full_url)

                    # Only follow links on same domain
                    if parsed.netloc == self.domain:
                        if full_url not in self.visited:
                            self.to_visit.append(full_url)

            except Exception as e:
                print(f"Error crawling {url}: {e}")
                continue

        print(f"Crawl complete. Found {len(self.visited)} pages")
        return list(self.visited)

    def get_forms(self, url: str) -> list:
        """Get all forms from a page"""
        try:
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.text, "html.parser")
            return soup.find_all("form")
        except:
            return []