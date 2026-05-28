from sqlalchemy.orm import Session
from app.models.models import Scan, User
from app.scanners.scan_engine import ScanEngine
from app.services.report_service import report_service
from app.core.config import settings
from datetime import datetime
from urllib.parse import urlparse

class ScanService:

    def validate_url(self, url: str) -> bool:
        """Block private/localhost URLs for safety"""
        try:
            parsed = urlparse(url)
            hostname = parsed.hostname

            # Block localhost and private IPs
            blocked = [
                "localhost", "127.0.0.1",
                "0.0.0.0", "::1"
            ]

            if hostname in blocked:
                return False

            # Must have valid scheme
            if parsed.scheme not in ["http", "https"]:
                return False

            return True
        except:
            return False

    def check_scan_limit(self, db: Session, user: User) -> bool:
        """Check if free user has exceeded daily scan limit"""
        if user.tier == "premium":
            return True

        from datetime import date
        today = date.today()
        todays_scans = db.query(Scan).filter(
            Scan.user_id == user.id,
        ).all()

        daily_scans = [
            s for s in todays_scans
            if s.created_at.date() == today
        ]

        return len(daily_scans) < settings.FREE_SCAN_LIMIT

    def run_scan(
        self,
        db: Session,
        scan_id: int,
        target_url: str
    ):
        """Run full scan and generate report"""

        # Update scan status to running
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        scan.status = "running"
        scan.started_at = datetime.utcnow()
        db.commit()

        try:
            # Run all scanners
            engine = ScanEngine(target_url)
            results = engine.run()

            # Save vulnerabilities to database
            report_service.save_vulnerabilities(db, scan_id, results)

            # Generate AI report
            report_service.create_report(db, scan_id, target_url, results)

            # Update scan status to done
            scan.status = "done"
            scan.finished_at = datetime.utcnow()
            db.commit()

            print(f"Scan {scan_id} completed successfully")
            return results

        except Exception as e:
            # Update scan status to failed
            scan.status = "failed"
            db.commit()
            print(f"Scan {scan_id} failed: {e}")
            raise e


scan_service = ScanService()