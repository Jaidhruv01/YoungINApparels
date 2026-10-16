import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "YoungINApparels API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./youngin_apparels.db")
    CORS_ORIGINS: List[str] = [
        "http://localhost:5190",
        "http://127.0.0.1:5190",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    CURRENCY: str = "INR"
    CURRENCY_SYMBOL: str = "₹"
    FREE_SHIPPING_THRESHOLD: float = 5000.00
    STANDARD_SHIPPING_FEE: float = 350.00
    EXPRESS_SHIPPING_FEE: float = 750.00
    TAX_RATE: float = 0.12  # 12% GST
    ADMIN_API_KEY: str = os.getenv("ADMIN_API_KEY", "youngin-secret-admin-key-2026")

settings = Settings()
