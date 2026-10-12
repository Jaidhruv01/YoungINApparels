from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import CartItem, ProductVariant, Product
from app.schemas.schemas import CartItemIn, CartItemUpdate, CartOut, CartItemDetail
from app.core.config import settings

router = APIRouter()

def build_cart_response(session_id: str, db: Session) -> CartOut:
    items = db.query(CartItem).filter(CartItem.session_id == session_id).all()
    item_details = []
    subtotal = 0.0

    for it in items:
        variant = it.variant
        if not variant or not variant.active:
            continue
        product = variant.product
        if not product or not product.active:
            continue

        item_total = round(variant.price * it.quantity, 2)
        subtotal += item_total

        item_details.append(CartItemDetail(
            id=it.id,
            variant_id=variant.id,
            product_id=product.id,
            product_title=product.title,
            product_slug=product.slug,
            sku=variant.sku,
            color=variant.color,
            size=variant.size,
            price=variant.price,
            compare_at_price=variant.compare_at_price,
            quantity=it.quantity,
            total_price=item_total,
            image_url=product.cover_image,
            available_quantity=variant.available_quantity
        ))

    subtotal = round(subtotal, 2)
    threshold = settings.FREE_SHIPPING_THRESHOLD
    has_free = subtotal >= threshold
    amount_needed = max(0.0, round(threshold - subtotal, 2))

    return CartOut(
        session_id=session_id,
        items=item_details,
        item_count=sum(i.quantity for i in item_details),
        subtotal=subtotal,
        free_shipping_threshold=threshold,
        amount_for_free_shipping=amount_needed,
        has_free_shipping=has_free
    )

@router.get("/cart", response_model=CartOut)
def get_cart(session_id: str = Query(...), db: Session = Depends(get_db)):
    return build_cart_response(session_id, db)

@router.post("/cart/items", response_model=CartOut)
def add_to_cart(payload: CartItemIn, db: Session = Depends(get_db)):
    variant = db.query(ProductVariant).filter(ProductVariant.id == payload.variant_id, ProductVariant.active == True).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not found")

    if variant.available_quantity < payload.quantity:
        raise HTTPException(status_code=400, detail=f"Only {variant.available_quantity} units available in stock")

    # Check if item already in cart
    existing = db.query(CartItem).filter(
        CartItem.session_id == payload.session_id,
        CartItem.variant_id == payload.variant_id
    ).first()

    if existing:
        new_qty = existing.quantity + payload.quantity
        if new_qty > variant.available_quantity:
            raise HTTPException(status_code=400, detail=f"Cannot add more than {variant.available_quantity} available units")
        existing.quantity = new_qty
    else:
        new_item = CartItem(
            session_id=payload.session_id,
            variant_id=payload.variant_id,
            quantity=payload.quantity
        )
        db.add(new_item)

    db.commit()
    return build_cart_response(payload.session_id, db)

@router.patch("/cart/items/{item_id}", response_model=CartOut)
def update_cart_item(item_id: int, payload: CartItemUpdate, session_id: str = Query(...), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.session_id == session_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if payload.quantity <= 0:
        db.delete(item)
    else:
        if payload.quantity > item.variant.available_quantity:
            raise HTTPException(status_code=400, detail=f"Maximum available stock is {item.variant.available_quantity}")
        item.quantity = payload.quantity

    db.commit()
    return build_cart_response(session_id, db)

@router.delete("/cart/items/{item_id}", response_model=CartOut)
def delete_cart_item(item_id: int, session_id: str = Query(...), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.session_id == session_id).first()
    if item:
        db.delete(item)
        db.commit()
    return build_cart_response(session_id, db)

@router.delete("/cart", response_model=CartOut)
def clear_cart(session_id: str = Query(...), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.session_id == session_id).delete()
    db.commit()
    return build_cart_response(session_id, db)
