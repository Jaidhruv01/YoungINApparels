from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Product
from app.schemas.schemas import ProductOut

router = APIRouter()

@router.get("/search")
def search_catalog(
    q: str = Query("", min_length=1),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    search_term = f"%{q.strip()}%"
    products = db.query(Product).filter(
        Product.active == True,
        (
            Product.title.ilike(search_term) |
            Product.description.ilike(search_term) |
            Product.category.ilike(search_term)
        )
    ).all()

    return {
        "query": q,
        "count": len(products),
        "results": [ProductOut.model_validate(p) for p in products]
    }

@router.get("/search/suggestions")
def search_suggestions(
    q: str = Query("", min_length=1),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    search_term = f"%{q.strip()}%"
    products = db.query(Product).filter(
        Product.active == True,
        (
            Product.title.ilike(search_term) |
            Product.category.ilike(search_term)
        )
    ).limit(5).all()

    matching_titles = [p.title for p in products]
    matching_categories = list(set([p.category for p in products]))

    return {
        "suggestions": matching_titles[:4],
        "categories": matching_categories[:3],
        "products": [
            {
                "id": p.id,
                "title": p.title,
                "slug": p.slug,
                "price": p.price,
                "compare_at_price": p.compare_at_price,
                "image": p.cover_image,
                "category": p.category
            }
            for p in products
        ]
    }
