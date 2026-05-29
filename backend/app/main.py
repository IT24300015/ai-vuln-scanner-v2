from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth
from app.api import scans
from app.core.database import engine, Base
from app.core.config import settings
from app.core.security import hash_password
from app.core.database import SessionLocal
from app.models.models import User, Scan, Vulnerability, Report
from app.models import models  # noqa: F401
from datetime import datetime

app = FastAPI(
    title="AI Vulnerability Scanner",
    description="Scan websites for vulnerabilities using AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(scans.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    bootstrap_demo_user()
    bootstrap_demo_scans()


def bootstrap_demo_user():
    demo_email = getattr(settings, "DEMO_LOGIN_EMAIL", "admin@enterprise.ai")
    demo_username = getattr(settings, "DEMO_LOGIN_USERNAME", "admin")
    demo_password = getattr(settings, "DEMO_LOGIN_PASSWORD", "admin123")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == demo_email).first()
        if user is None:
            user = db.query(User).filter(User.username == demo_username).first()

        if user is None:
            user = User(
                username=demo_username,
                email=demo_email,
                hashed_password=hash_password(demo_password),
                tier="free",
            )
            db.add(user)
        else:
            user.username = demo_username
            user.email = demo_email
            user.hashed_password = hash_password(demo_password)

        db.commit()
    finally:
        db.close()


def bootstrap_demo_scans():
    demo_email = getattr(settings, "DEMO_LOGIN_EMAIL", "admin@enterprise.ai")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == demo_email).first()
        if user is None:
            return

        existing_count = db.query(Scan).filter(Scan.user_id == user.id).count()
        if existing_count > 0:
            return

        sample_scans = [
            {
                "target_url": "https://demo-app.local",
                "status": "done",
                "vulnerabilities": [
                    {
                        "vuln_type": "XSS",
                        "severity": "high",
                        "url": "https://demo-app.local/search",
                        "description": "Unsanitized search input is reflected in the response.",
                        "confidence_score": 92.0,
                        "evidence": "<script>alert(1)</script> echoed back",
                    },
                    {
                        "vuln_type": "Security Header",
                        "severity": "medium",
                        "url": "https://demo-app.local",
                        "description": "Missing Content-Security-Policy header.",
                        "confidence_score": 78.0,
                        "evidence": "CSP header not present",
                    },
                ],
                "summary": "Demo assessment found client-side injection and missing security headers.",
            },
            {
                "target_url": "https://demo-shop.local",
                "status": "done",
                "vulnerabilities": [
                    {
                        "vuln_type": "SQLi",
                        "severity": "critical",
                        "url": "https://demo-shop.local/product?id=7",
                        "description": "Parameter appears injectable via error-based probing.",
                        "confidence_score": 96.0,
                        "evidence": "Database error returned for malformed input",
                    },
                    {
                        "vuln_type": "Open Redirect",
                        "severity": "low",
                        "url": "https://demo-shop.local/redirect?next=http://example.com",
                        "description": "Unvalidated redirect target can send users to external sites.",
                        "confidence_score": 84.0,
                        "evidence": "Redirects to arbitrary URL parameter",
                    },
                ],
                "summary": "Demo storefront exposes injection and redirect risks.",
            },
        ]

        for item in sample_scans:
            scan = Scan(
                user_id=user.id,
                target_url=item["target_url"],
                status=item["status"],
                started_at=datetime.utcnow(),
                finished_at=datetime.utcnow(),
            )
            db.add(scan)
            db.flush()

            for vulnerability in item["vulnerabilities"]:
                db.add(Vulnerability(
                    scan_id=scan.id,
                    vuln_type=vulnerability["vuln_type"],
                    severity=vulnerability["severity"],
                    url=vulnerability["url"],
                    description=vulnerability["description"],
                    confidence_score=vulnerability["confidence_score"],
                    evidence=vulnerability["evidence"],
                ))

            db.add(Report(
                scan_id=scan.id,
                ai_summary=item["summary"],
                pdf_path=None,
            ))

        db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "AI Vulnerability Scanner API is running"}