import os


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./ai_vuln_scanner.db",
    )
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-this-secret")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    FREE_SCAN_LIMIT: int = int(os.getenv("FREE_SCAN_LIMIT", "3"))
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24


settings = Settings()