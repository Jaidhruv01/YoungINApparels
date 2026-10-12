from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# Variant Schemas
class ProductVariantBase(BaseModel):
    sku: str
    color: str
    color_code: str
    size: str
    price: float
    compare_at_price: Optional[float] = None
    available_quantity: int = 10
    active: bool = True

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantOut(ProductVariantBase):
    id: int
    product_id: int
    model_config = ConfigDict(from_attributes=True)

# Image Schemas
class ProductImageOut(BaseModel):
    id: int
    url: str
    alt_text: Optional[str] = None
    position: int = 0
    variant_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

# Product Schemas
class ProductBase(BaseModel):
    title: str
    slug: str
    description: str
    short_summary: Optional[str] = None
    category: str
    price: float
    compare_at_price: Optional[float] = None
    details: Optional[str] = None
    fabric_care: Optional[str] = None
    fit_info: Optional[str] = None
    is_new: bool = False
    is_bestseller: bool = False
    is_sale: bool = False
    is_featured: bool = False
    cover_image: str
    hover_image: Optional[str] = None
    active: bool = True

class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    variants: List[ProductVariantOut] = []
    images: List[ProductImageOut] = []
    model_config = ConfigDict(from_attributes=True)

# Collection Schemas
class CollectionBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    image: Optional[str] = None
    badge: Optional[str] = None
    sort_order: int = 0
    active: bool = True

class CollectionOut(CollectionBase):
    id: int
    product_count: Optional[int] = 0
    model_config = ConfigDict(from_attributes=True)

class CollectionDetailOut(CollectionOut):
    products: List[ProductOut] = []

# Hotspots
class LookbookHotspotOut(BaseModel):
    id: int
    x_percent: float
    y_percent: float
    product_id: int
    title: str
    price: float
    tag: str
    active: bool
    product_slug: Optional[str] = None
    product_image: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class LookbookHotspotIn(BaseModel):
    x_percent: float
    y_percent: float
    product_id: int
    title: str
    price: float
    tag: Optional[str] = "Featured Piece"

# CMS
class CMSContentOut(BaseModel):
    id: int
    section_key: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    image_url: Optional[str] = None
    meta_json: Optional[Dict[str, Any]] = None
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CMSContentUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    image_url: Optional[str] = None
    meta_json: Optional[Dict[str, Any]] = None

# Cart Schemas
class CartItemIn(BaseModel):
    session_id: str
    variant_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemDetail(BaseModel):
    id: int
    variant_id: int
    product_id: int
    product_title: str
    product_slug: str
    sku: str
    color: str
    size: str
    price: float
    compare_at_price: Optional[float] = None
    quantity: int
    total_price: float
    image_url: str
    available_quantity: int

class CartOut(BaseModel):
    session_id: str
    items: List[CartItemDetail] = []
    item_count: int = 0
    subtotal: float = 0.0
    free_shipping_threshold: float = 5000.0
    amount_for_free_shipping: float = 5000.0
    has_free_shipping: bool = False

# Checkout & Orders
class CheckoutQuoteIn(BaseModel):
    items: List[Dict[str, Any]]  # [{"variant_id": 1, "quantity": 1}]
    shipping_method: str = "standard"  # "standard" | "express"
    discount_code: Optional[str] = None

class CheckoutQuoteOut(BaseModel):
    subtotal: float
    discount: float
    shipping: float
    tax: float
    total: float
    discount_code_applied: Optional[str] = None
    discount_applied_amount: float = 0.0
    free_shipping_eligible: bool

class OrderCreateIn(BaseModel):
    session_id: Optional[str] = None
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address1: str
    address2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str = "India"
    shipping_method: str = "standard"
    payment_method: str = "credit_card"
    discount_code: Optional[str] = None
    items: List[Dict[str, Any]]  # [{"variant_id": 1, "quantity": 1}]

class OrderItemOut(BaseModel):
    id: int
    variant_id: int
    product_title: str
    variant_color: str
    variant_size: str
    sku: str
    unit_price: float
    quantity: int
    total_price: float
    image_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class OrderOut(BaseModel):
    id: int
    order_number: str
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address1: str
    address2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    shipping_method: str
    payment_method: str
    subtotal: float
    discount: float
    shipping: float
    tax: float
    total: float
    status: str
    payment_status: str
    tracking_number: Optional[str] = None
    discount_code: Optional[str] = None
    created_at: datetime
    items: List[OrderItemOut] = []
    model_config = ConfigDict(from_attributes=True)

# Discounts
class DiscountValidateIn(BaseModel):
    code: str
    subtotal: float

class DiscountValidateOut(BaseModel):
    valid: bool
    code: str
    discount_type: Optional[str] = None
    value: Optional[float] = 0.0
    calculated_discount: float = 0.0
    message: str

# Newsletter
class NewsletterIn(BaseModel):
    email: str

# Admin
class AdminInventoryUpdate(BaseModel):
    variant_id: int
    available_quantity: int

class AdminOrderStatusUpdate(BaseModel):
    status: str
    tracking_number: Optional[str] = None
