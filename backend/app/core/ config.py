from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    # App
    APP_NAME: str = "AI Vulnerability Scanner"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = os.getenv("postgresql://postgres:utwzyqTZdCYWVXtbkVpYgyRdSBxVEgeb@kodama.proxy.rlwy.net:53655/railway", "")

    # JWT
    JWT_SECRET: str = os.getenv("mySuperSecretKey2024Scanner!XyZ99", "")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24

    # Gemini
    GEMINI_API_KEY: str = os.getenv("AIzaSyCyE4HJm-AdrKPteTisxgWijgK1snkjZRA", "")

    # Free tier limit
    FREE_SCAN_LIMIT: int = 3

settings = Settings()