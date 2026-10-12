from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    short_summary = Column(String(500), nullable=True)
    category = Column(String(100), index=True, nullable=False) # Outerwear, Tops, Bottoms, Footwear, Accessories
    price = Column(Float, nullable=False)
    compare_at_price = Column(Float, nullable=True)
    details = Column(Text, nullable=True)
    fabric_care = Column(Text, nullable=True)
    fit_info = Column(Text, nullable=True)
    is_new = Column(Boolean, default=False)
    is_bestseller = Column(Boolean, default=False)
    is_sale = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    cover_image = Column(String(500), nullable=False)
    hover_image = Column(String(500), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    collection_links = relationship("CollectionProduct", back_populates="product", cascade="all, delete-orphan")
    hotspots = relationship("LookbookHotspot", back_populates="product")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    color = Column(String(50), nullable=False)
    color_code = Column(String(20), nullable=False) # e.g. #111111, #B51224
    size = Column(String(20), nullable=False) # XS, S, M, L, XL, XXL, ONE-SIZE
    price = Column(Float, nullable=False)
    compare_at_price = Column(Float, nullable=True)
    available_quantity = Column(Integer, default=10, nullable=False)
    active = Column(Boolean, default=True)

    product = relationship("Product", back_populates="variants")
    images = relationship("ProductImage", back_populates="variant")

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    url = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=True)
    position = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")
    variant = relationship("ProductVariant", back_populates="images")

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    badge = Column(String(100), nullable=True)
    sort_order = Column(Integer, default=0)
    active = Column(Boolean, default=True)

    product_links = relationship("CollectionProduct", back_populates="collection", cascade="all, delete-orphan")

class CollectionProduct(Base):
    __tablename__ = "collection_products"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    position = Column(Integer, default=0)

    collection = relationship("Collection", back_populates="product_links")
    product = relationship("Product", back_populates="collection_links")

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    variant = relationship("ProductVariant")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(50), nullable=True)
    address1 = Column(String(255), nullable=False)
    address2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    postal_code = Column(String(50), nullable=False)
    country = Column(String(100), default="United States", nullable=False)
    shipping_method = Column(String(50), default="standard", nullable=False)
    payment_method = Column(String(50), default="credit_card", nullable=False)
    subtotal = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    shipping = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    status = Column(String(50), default="confirmed") # confirmed, processing, shipped, delivered, cancelled
    payment_status = Column(String(50), default="paid") # paid, refunded, failed
    tracking_number = Column(String(100), nullable=True)
    discount_code = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=False)
    product_title = Column(String(255), nullable=False)
    variant_color = Column(String(50), nullable=False)
    variant_size = Column(String(20), nullable=False)
    sku = Column(String(100), nullable=False)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=True)

    order = relationship("Order", back_populates="items")
    variant = relationship("ProductVariant")

class Discount(Base):
    __tablename__ = "discounts"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    discount_type = Column(String(20), default="percentage") # percentage or fixed
    value = Column(Float, nullable=False) # e.g. 15 for 15% or 25 for $25 off
    minimum_order_value = Column(Float, default=0.0)
    active = Column(Boolean, default=True)
    usage_count = Column(Integer, default=0)
    max_uses = Column(Integer, default=1000)

class LookbookHotspot(Base):
    __tablename__ = "lookbook_hotspots"

    id = Column(Integer, primary_key=True, index=True)
    x_percent = Column(Float, nullable=False) # 0 to 100 percentage
    y_percent = Column(Float, nullable=False) # 0 to 100 percentage
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    title = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    tag = Column(String(100), default="Featured Piece")
    active = Column(Boolean, default=True)

    product = relationship("Product", back_populates="hotspots")

class CMSContent(Base):
    __tablename__ = "cms_content"

    id = Column(Integer, primary_key=True, index=True)
    section_key = Column(String(100), unique=True, index=True, nullable=False) # announcement, hero, editorial_split, curated_feature, brand_statement
    title = Column(String(255), nullable=True)
    subtitle = Column(Text, nullable=True)
    cta_text = Column(String(100), nullable=True)
    cta_link = Column(String(255), nullable=True)
    image_url = Column(String(500), nullable=True)
    meta_json = Column(JSON, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
