from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import User, Scan, Vulnerability, Report
from app.api.schemas import ScanCreate, ScanResponse, VulnerabilityResponse
from app.services.scan_service import scan_service
from typing import List

router = APIRouter(prefix="/api/scans", tags=["Scans"])


# ─── CREATE SCAN ──────────────────────────────────────────
@router.post("/", response_model=ScanResponse)
def create_scan(
    scan_data: ScanCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check scan limit
    if not scan_service.check_scan_limit(db, current_user):
        raise HTTPException(
            status_code=429,
            detail="Daily scan limit reached. Upgrade to premium for unlimited scans."
        )

    # Validate URL — allow localhost for testing
    parsed_url = scan_data.target_url
    if not parsed_url.startswith("http"):
        raise HTTPException(status_code=400, detail="URL must start with http or https")

    # Create scan record
    new_scan = Scan(
        user_id=current_user.id,
        target_url=scan_data.target_url,
        status="queued"
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    # Run scan in background
    background_tasks.add_task(
        scan_service.run_scan,
        db,
        new_scan.id,
        scan_data.target_url
    )

    return new_scan


# ─── GET ALL MY SCANS ─────────────────────────────────────
@router.get("/", response_model=List[ScanResponse])
def get_my_scans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scans = db.query(Scan).filter(
        Scan.user_id == current_user.id
    ).order_by(Scan.created_at.desc()).all()
    return scans


# ─── GET SCAN BY ID ───────────────────────────────────────
@router.get("/{scan_id}")
def get_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scan = db.query(Scan).filter(
        Scan.id == scan_id,
        Scan.user_id == current_user.id
    ).first()

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    # Get vulnerabilities
    vulns = db.query(Vulnerability).filter(
        Vulnerability.scan_id == scan_id
    ).all()

    # Get report
    report = db.query(Report).filter(
        Report.scan_id == scan_id
    ).first()

    return {
        "id": scan.id,
        "target_url": scan.target_url,
        "status": scan.status,
        "created_at": scan.created_at,
        "started_at": scan.started_at,
        "finished_at": scan.finished_at,
        "vulnerabilities": [
            {
                "vuln_type": v.vuln_type,
                "severity": v.severity,
                "url": v.url,
                "description": v.description,
                "confidence_score": v.confidence_score,
                "evidence": v.evidence
            }
            for v in vulns
        ],
        "report": {
            "ai_summary": report.ai_summary if report else None
        }
    }