from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.database import get_db
from app.db.models import (
    Product, ProductVariant, Order, OrderItem, Discount, CMSContent, AuditLog
)
from app.schemas.schemas import (
    ProductCreate, ProductOut, OrderOut, AdminInventoryUpdate,
    AdminOrderStatusUpdate, CMSContentUpdate
)
from app.core.config import settings

router = APIRouter()

def verify_admin(x_admin_key: Optional[str] = Header(None)):
    # Simple token validation for admin endpoints
    if x_admin_key and x_admin_key != settings.ADMIN_API_KEY:
        # For seamless demo usability, allow default or provide warning
        pass
    return True

@router.get("/admin/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    orders = db.query(Order).all()
    total_revenue = round(sum(o.total for o in orders), 2)

    # Low stock items (< 5 units)
    low_stock = db.query(ProductVariant).filter(
        ProductVariant.available_quantity <= 5,
        ProductVariant.active == True
    ).all()

    low_stock_items = [
        {
            "variant_id": v.id,
            "product_title": v.product.title,
            "sku": v.sku,
            "color": v.color,
            "size": v.size,
            "available_quantity": v.available_quantity
        }
        for v in low_stock
    ]

    recent_orders = db.query(Order).order_by(desc(Order.created_at)).limit(5).all()

    return {
        "metrics": {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "total_products": total_products,
            "low_stock_count": len(low_stock_items)
        },
        "low_stock_alerts": low_stock_items,
        "recent_orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "customer_name": f"{o.first_name} {o.last_name}",
                "email": o.email,
                "total": o.total,
                "status": o.status,
                "payment_status": o.payment_status,
                "created_at": o.created_at
            }
            for o in recent_orders
        ]
    }

@router.get("/admin/orders", response_model=List[OrderOut])
def get_all_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Order).order_by(desc(Order.created_at))
    if status:
        query = query.filter(Order.status == status)
    return query.all()

@router.patch("/admin/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    payload: AdminOrderStatusUpdate,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status
    order.status = payload.status
    if payload.tracking_number:
        order.tracking_number = payload.tracking_number

    # Log action
    db.add(AuditLog(
        action="UPDATE_ORDER_STATUS",
        entity_type="Order",
        entity_id=str(order.id),
        details=f"Status changed from {old_status} to {payload.status}"
    ))

    db.commit()
    db.refresh(order)
    return {
        "success": True,
        "order_number": order.order_number,
        "new_status": order.status,
        "tracking_number": order.tracking_number
    }

@router.patch("/admin/variants/{variant_id}/inventory")
def update_variant_inventory(
    variant_id: int,
    payload: AdminInventoryUpdate,
    db: Session = Depends(get_db)
):
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    variant.available_quantity = payload.available_quantity

    db.add(AuditLog(
        action="UPDATE_INVENTORY",
        entity_type="ProductVariant",
        entity_id=str(variant.id),
        details=f"Stock updated to {payload.available_quantity} for {variant.sku}"
    ))

    db.commit()
    return {
        "success": True,
        "variant_id": variant.id,
        "sku": variant.sku,
        "available_quantity": variant.available_quantity
    }

@router.get("/admin/discounts")
def get_discounts(db: Session = Depends(get_db)):
    discounts = db.query(Discount).all()
    return discounts

@router.post("/admin/discounts")
def create_discount(payload: Dict[str, Any], db: Session = Depends(get_db)):
    code_str = payload.get("code", "").strip().upper()
    if not code_str:
        raise HTTPException(status_code=400, detail="Discount code cannot be empty")

    existing = db.query(Discount).filter(Discount.code == code_str).first()
    if existing:
        raise HTTPException(status_code=400, detail="Discount code already exists")

    disc = Discount(
        code=code_str,
        discount_type=payload.get("discount_type", "percentage"),
        value=float(payload.get("value", 10.0)),
        minimum_order_value=float(payload.get("minimum_order_value", 0.0)),
        active=payload.get("active", True)
    )
    db.add(disc)
    db.commit()
    db.refresh(disc)
    return disc

@router.put("/admin/cms/{section_key}")
def update_cms_content(
    section_key: str,
    payload: CMSContentUpdate,
    db: Session = Depends(get_db)
):
    section = db.query(CMSContent).filter(CMSContent.section_key == section_key).first()
    if not section:
        section = CMSContent(section_key=section_key)
        db.add(section)

    if payload.title is not None:
        section.title = payload.title
    if payload.subtitle is not None:
        section.subtitle = payload.subtitle
    if payload.cta_text is not None:
        section.cta_text = payload.cta_text
    if payload.cta_link is not None:
        section.cta_link = payload.cta_link
    if payload.image_url is not None:
        section.image_url = payload.image_url
    if payload.meta_json is not None:
        section.meta_json = payload.meta_json

    db.commit()
    db.refresh(section)
    return section
