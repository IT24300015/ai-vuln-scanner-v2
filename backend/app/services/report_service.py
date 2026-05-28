from sqlalchemy.orm import Session
from app.models.models import Report, Scan, Vulnerability
from app.scanners.base_scanner import ScanResult
from app.services.gemini_service import gemini_service
from typing import List
import os

class ReportService:

    def create_report(
        self,
        db: Session,
        scan_id: int,
        target_url: str,
        vulnerabilities: List[ScanResult]
    ) -> Report:
        """Generate AI report and save to database"""

        print(f"Generating AI report for scan {scan_id}...")

        # Get AI analysis from Gemini
        ai_summary = gemini_service.generate_report(
            target_url,
            vulnerabilities
        )

        # Save report to database
        report = Report(
            scan_id=scan_id,
            ai_summary=ai_summary,
        )
        db.add(report)
        db.commit()
        db.refresh(report)

        print(f"Report saved to database (id: {report.id})")
        return report

    def save_vulnerabilities(
        self,
        db: Session,
        scan_id: int,
        results: List[ScanResult]
    ):
        """Save scan results to database"""
        for result in results:
            vuln = Vulnerability(
                scan_id=scan_id,
                vuln_type=result.vuln_type,
                severity=result.severity,
                url=result.url,
                description=result.description,
                confidence_score=result.confidence_score,
                evidence=result.evidence
            )
            db.add(vuln)

        db.commit()
        print(f"Saved {len(results)} vulnerabilities to database")


report_service = ReportService()