from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from app.db.database import get_db
from app.db.models import Product, Collection, CollectionProduct
from app.schemas.schemas import ProductOut, CollectionOut, CollectionDetailOut

router = APIRouter()

@router.get("/products", response_model=List[ProductOut])
def list_products(
    category: Optional[str] = None,
    sort_by: Optional[str] = Query("newest", pattern="^(newest|price_asc|price_desc|bestseller)$"),
    collection_slug: Optional[str] = None,
    tab: Optional[str] = None,  # "new", "bestsellers", "sale"
    q: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.active == True)

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))

    if tab == "new":
        query = query.filter(Product.is_new == True)
    elif tab == "bestsellers":
        query = query.filter(Product.is_bestseller == True)
    elif tab == "sale":
        query = query.filter(Product.is_sale == True)

    if q:
        query = query.filter(
            Product.title.ilike(f"%{q}%") |
            Product.description.ilike(f"%{q}%") |
            Product.category.ilike(f"%{q}%")
        )

    if collection_slug:
        collection = db.query(Collection).filter(Collection.slug == collection_slug).first()
        if collection:
            product_ids = [cp.product_id for cp in collection.product_links]
            query = query.filter(Product.id.in_(product_ids))

    if sort_by == "price_asc":
        query = query.order_by(asc(Product.price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Product.price))
    elif sort_by == "bestseller":
        query = query.order_by(desc(Product.is_bestseller), desc(Product.id))
    else:
        query = query.order_by(desc(Product.id))

    return query.all()

@router.get("/products/{slug}", response_model=ProductOut)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug, Product.active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/collections", response_model=List[CollectionOut])
def list_collections(db: Session = Depends(get_db)):
    collections = db.query(Collection).filter(Collection.active == True).order_by(Collection.sort_order).all()
    results = []
    for c in collections:
        c_dict = {
            "id": c.id,
            "title": c.title,
            "slug": c.slug,
            "description": c.description,
            "image": c.image,
            "badge": c.badge,
            "sort_order": c.sort_order,
            "active": c.active,
            "product_count": len(c.product_links)
        }
        results.append(CollectionOut(**c_dict))
    return results

@router.get("/collections/{slug}", response_model=CollectionDetailOut)
def get_collection_by_slug(slug: str, db: Session = Depends(get_db)):
    collection = db.query(Collection).filter(Collection.slug == slug, Collection.active == True).first()
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")

    products = [cp.product for cp in collection.product_links if cp.product.active]
    return CollectionDetailOut(
        id=collection.id,
        title=collection.title,
        slug=collection.slug,
        description=collection.description,
        image=collection.image,
        badge=collection.badge,
        sort_order=collection.sort_order,
        active=collection.active,
        product_count=len(products),
        products=products
    )

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(Product.category).distinct().all()
    return [c[0] for c in cats if c[0]]
