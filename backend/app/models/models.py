from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# ─── TABLE 1: Users ───────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    email         = Column(String, unique=True, index=True, nullable=False)
    username      = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    tier          = Column(String, default="free")  # free or premium
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    scans = relationship("Scan", back_populates="user")


# ─── TABLE 2: Scans ───────────────────────────────────────
class Scan(Base):
    __tablename__ = "scans"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_url  = Column(String, nullable=False)
    status      = Column(String, default="queued")  # queued, running, done, failed
    started_at  = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user            = relationship("User", back_populates="scans")
    vulnerabilities = relationship("Vulnerability", back_populates="scan")
    report          = relationship("Report", back_populates="scan", uselist=False)


# ─── TABLE 3: Vulnerabilities ─────────────────────────────
class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id               = Column(Integer, primary_key=True, index=True)
    scan_id          = Column(Integer, ForeignKey("scans.id"), nullable=False)
    vuln_type        = Column(String, nullable=False)   # XSS, SQLi, etc.
    severity         = Column(String, nullable=False)   # critical/high/medium/low
    url              = Column(String, nullable=False)
    description      = Column(Text, nullable=True)
    confidence_score = Column(Float, default=0.0)       # 0.0 to 100.0
    evidence         = Column(Text, nullable=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    scan = relationship("Scan", back_populates="vulnerabilities")


# ─── TABLE 4: Reports ─────────────────────────────────────
class Report(Base):
    __tablename__ = "reports"

    id          = Column(Integer, primary_key=True, index=True)
    scan_id     = Column(Integer, ForeignKey("scans.id"), nullable=False)
    ai_summary  = Column(Text, nullable=True)
    pdf_path    = Column(String, nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    scan = relationship("Scan", back_populates="report")


# ─── TABLE 5: Scan Queue ──────────────────────────────────
class ScanQueue(Base):
    __tablename__ = "scan_queue"

    id         = Column(Integer, primary_key=True, index=True)
    scan_id    = Column(Integer, ForeignKey("scans.id"), nullable=False)
    priority   = Column(Integer, default=1)
    status     = Column(String, default="waiting")  # waiting, processing, done
    created_at = Column(DateTime(timezone=True), server_default=func.now())
