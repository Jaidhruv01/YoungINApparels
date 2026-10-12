from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import CMSContent, LookbookHotspot, Product
from app.schemas.schemas import CMSContentOut, LookbookHotspotOut

router = APIRouter()

@router.get("/cms/homepage")
def get_homepage_cms(db: Session = Depends(get_db)) -> Dict[str, Any]:
    contents = db.query(CMSContent).all()
    sections = {}
    for c in contents:
        sections[c.section_key] = {
            "id": c.id,
            "section_key": c.section_key,
            "title": c.title,
            "subtitle": c.subtitle,
            "cta_text": c.cta_text,
            "cta_link": c.cta_link,
            "image_url": c.image_url,
            "meta_json": c.meta_json,
            "updated_at": c.updated_at
        }
    return sections

@router.get("/lookbook")
def get_lookbook_data(db: Session = Depends(get_db)) -> Dict[str, Any]:
    hotspots = db.query(LookbookHotspot).filter(LookbookHotspot.active == True).all()
    hotspot_list = []
    for h in hotspots:
        product = h.product
        hotspot_list.append({
            "id": h.id,
            "x_percent": h.x_percent,
            "y_percent": h.y_percent,
            "product_id": h.product_id,
            "title": h.title,
            "price": h.price,
            "tag": h.tag,
            "active": h.active,
            "product_slug": product.slug if product else None,
            "product_image": product.cover_image if product else None
        })

    return {
        "title": "ARCHIVE LOOKBOOK // 01",
        "subtitle": "Interactive styling and uniform breakdown. Tap or hover over hotspots to inspect and instantly acquire garments.",
        "image_url": "/images/lookbook-campaign.jpg",
        "hotspots": hotspot_list
    }
