from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    tier: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ScanCreate(BaseModel):
    target_url: str

class ScanResponse(BaseModel):
    id: int
    target_url: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class VulnerabilityResponse(BaseModel):
    id: int
    vuln_type: str
    severity: str
    url: str
    description: Optional[str]
    confidence_score: float
    evidence: Optional[str]

    class Config:
        from_attributes = True