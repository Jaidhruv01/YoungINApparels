from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import NewsletterSubscriber
from app.schemas.schemas import NewsletterIn

router = APIRouter()

@router.post("/newsletter/subscribe")
def subscribe_newsletter(payload: NewsletterIn, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    existing = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email_clean).first()
    if existing:
        return {
            "success": True,
            "message": "You are already subscribed to the YoungINApparels archive dispatch."
        }

    sub = NewsletterSubscriber(email=email_clean)
    db.add(sub)
    db.commit()
    return {
        "success": True,
        "message": "Welcome to the YoungINApparels archive. A 10% welcome invitation has been logged."
    }
