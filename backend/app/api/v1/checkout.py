import uuid
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Order, OrderItem, ProductVariant, Product, Discount, CartItem
from app.schemas.schemas import (
    CheckoutQuoteIn, CheckoutQuoteOut, OrderCreateIn, OrderOut,
    DiscountValidateIn, DiscountValidateOut
)
from app.core.config import settings

router = APIRouter()

def calculate_quote_details(payload: CheckoutQuoteIn, db: Session) -> Dict[str, Any]:
    subtotal = 0.0
    for item in payload.items:
        variant_id = item.get("variant_id")
        quantity = item.get("quantity", 1)
        variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id, ProductVariant.active == True).first()
        if not variant:
            raise HTTPException(status_code=400, detail=f"Variant ID {variant_id} not found or inactive")
        if variant.available_quantity < quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {variant.sku}. Only {variant.available_quantity} left.")
        subtotal += round(variant.price * quantity, 2)

    subtotal = round(subtotal, 2)
    discount_amount = 0.0
    discount_code_applied = None

    if payload.discount_code:
        code_str = payload.discount_code.strip().upper()
        discount_obj = db.query(Discount).filter(Discount.code == code_str, Discount.active == True).first()
        if discount_obj:
            if subtotal >= discount_obj.minimum_order_value:
                if discount_obj.discount_type == "percentage":
                    discount_amount = round(subtotal * (discount_obj.value / 100.0), 2)
                else:
                    discount_amount = min(subtotal, round(discount_obj.value, 2))
                discount_code_applied = code_str

    free_shipping = subtotal >= settings.FREE_SHIPPING_THRESHOLD
    if payload.shipping_method == "express":
        shipping_fee = settings.EXPRESS_SHIPPING_FEE
    else:
        shipping_fee = 0.0 if free_shipping else settings.STANDARD_SHIPPING_FEE

    taxable_amount = max(0.0, subtotal - discount_amount)
    tax = round(taxable_amount * settings.TAX_RATE, 2)
    total = round(taxable_amount + shipping_fee + tax, 2)

    return {
        "subtotal": subtotal,
        "discount": discount_amount,
        "shipping": shipping_fee,
        "tax": tax,
        "total": total,
        "discount_code_applied": discount_code_applied,
        "discount_applied_amount": discount_amount,
        "free_shipping_eligible": free_shipping
    }

@router.post("/checkout/quote", response_model=CheckoutQuoteOut)
def get_checkout_quote(payload: CheckoutQuoteIn, db: Session = Depends(get_db)):
    calc = calculate_quote_details(payload, db)
    return CheckoutQuoteOut(**calc)

@router.post("/discounts/validate", response_model=DiscountValidateOut)
def validate_discount(payload: DiscountValidateIn, db: Session = Depends(get_db)):
    code_str = payload.code.strip().upper()
    discount = db.query(Discount).filter(Discount.code == code_str, Discount.active == True).first()
    if not discount:
        return DiscountValidateOut(
            valid=False,
            code=payload.code,
            calculated_discount=0.0,
            message="Invalid or expired promotional code."
        )

    if payload.subtotal < discount.minimum_order_value:
        return DiscountValidateOut(
            valid=False,
            code=discount.code,
            calculated_discount=0.0,
            message=f"Code requires a minimum order subtotal of ${discount.minimum_order_value:.2f}"
        )

    if discount.discount_type == "percentage":
        calc_amt = round(payload.subtotal * (discount.value / 100.0), 2)
        msg = f"Applied {int(discount.value)}% off your order!"
    else:
        calc_amt = min(payload.subtotal, round(discount.value, 2))
        msg = f"Applied ${discount.value:.2f} off your order!"

    return DiscountValidateOut(
        valid=True,
        code=discount.code,
        discount_type=discount.discount_type,
        value=discount.value,
        calculated_discount=calc_amt,
        message=msg
    )

@router.post("/orders", response_model=OrderOut)
def create_order(payload: OrderCreateIn, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cannot place an empty order")

    # Recalculate everything strictly on the server
    quote_in = CheckoutQuoteIn(
        items=payload.items,
        shipping_method=payload.shipping_method,
        discount_code=payload.discount_code
    )
    quote = calculate_quote_details(quote_in, db)

    order_num = f"YIN-{uuid.uuid4().hex[:8].upper()}"

    order = Order(
        order_number=order_num,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        phone=payload.phone,
        address1=payload.address1,
        address2=payload.address2,
        city=payload.city,
        state=payload.state,
        postal_code=payload.postal_code,
        country=payload.country,
        shipping_method=payload.shipping_method,
        payment_method=payload.payment_method,
        subtotal=quote["subtotal"],
        discount=quote["discount"],
        shipping=quote["shipping"],
        tax=quote["tax"],
        total=quote["total"],
        status="confirmed",
        payment_status="paid",
        discount_code=quote["discount_code_applied"],
        tracking_number=f"TRK{uuid.uuid4().hex[:10].upper()}"
    )
    db.add(order)
    db.flush()

    for item in payload.items:
        variant_id = item["variant_id"]
        qty = item["quantity"]
        variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).with_for_update().first()

        if not variant or variant.available_quantity < qty:
            db.rollback()
            raise HTTPException(status_code=400, detail=f"Stock changed for variant {variant_id}. Please refresh cart.")

        # Decrement stock
        variant.available_quantity -= qty

        product = variant.product
        line_item = OrderItem(
            order_id=order.id,
            variant_id=variant.id,
            product_title=product.title,
            variant_color=variant.color,
            variant_size=variant.size,
            sku=variant.sku,
            unit_price=variant.price,
            quantity=qty,
            total_price=round(variant.price * qty, 2),
            image_url=product.cover_image
        )
        db.add(line_item)

    # Clear session cart if session_id provided
    if payload.session_id:
        db.query(CartItem).filter(CartItem.session_id == payload.session_id).delete()

    # Increment discount usage
    if quote["discount_code_applied"]:
        disc = db.query(Discount).filter(Discount.code == quote["discount_code_applied"]).first()
        if disc:
            disc.usage_count += 1

    db.commit()
    db.refresh(order)
    return order

@router.get("/orders/{order_number}", response_model=OrderOut)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
