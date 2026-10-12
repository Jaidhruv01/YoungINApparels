import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { ProductCard } from '../components/product/ProductCard';
import {
  ChevronDown, ChevronUp,
  Ruler, ShoppingBag, Zap
} from 'lucide-react';

interface ProductDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ slug, onNavigate }) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    craftsmanship: false,
    fit: false,
    shipping: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await api.getProductBySlug(slug);
        setProduct(data);
        setSelectedImage(data.cover_image);

        if (data.variants.length > 0) {
          const firstVariant = data.variants[0];
          setSelectedColor(firstVariant.color);
          setSelectedSize(firstVariant.size);
        }

        // Load recommended cross-sells
        const allProds = await api.getProducts();
        setRecommended(allProds.filter((p: Product) => p.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="container-custom" style={{ padding: '6rem 0', minHeight: '70vh' }}>
        <div style={{ height: '500px' }} className="skeleton" />
      </div>
    );
  }

  // Colorways
  const distinctColors: { name: string; code: string }[] = Array.from(
    new Set(product.variants.map((v: ProductVariant) => JSON.stringify({ name: v.color, code: v.color_code })))
  ).map((str: any) => JSON.parse(str));

  // Current selected variant
  const currentVariant = product.variants.find(
    (v: ProductVariant) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants.find((v: ProductVariant) => v.color === selectedColor) || product.variants[0];

  // Available sizes for current color
  const sizesForColor = product.variants
    .filter((v: ProductVariant) => v.color === selectedColor)
    .map((v: ProductVariant) => ({
      size: v.size,
      available_quantity: v.available_quantity,
      id: v.id,
    }));

  const isCurrentOutOfStock = !currentVariant || currentVariant.available_quantity <= 0;
  const isLowStock = currentVariant && currentVariant.available_quantity > 0 && currentVariant.available_quantity <= 4;

  const handleAddToCart = async () => {
    if (!currentVariant || isCurrentOutOfStock) return;
    try {
      setAddingToCart(true);
      await addToCart(currentVariant.id, quantity);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleExpressCheckout = async () => {
    if (!currentVariant || isCurrentOutOfStock) return;
    await addToCart(currentVariant.id, quantity);
    onNavigate('/checkout');
  };

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : null;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', paddingBottom: '6rem' }}>
      {/* Breadcrumb Bar */}
      <div style={{ borderBottom: '1px solid #f0efed', backgroundColor: '#faf9f8' }}>
        <div className="container-custom" style={{ padding: '0.875rem 0', fontSize: '0.75rem', color: '#6b6b6b' }}>
          <button
            onClick={() => onNavigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }}
          >
            HOME
          </button>
          {' / '}
          <button
            onClick={() => onNavigate(`/collections`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b' }}
          >
            ARCHIVE
          </button>
          {' / '}
          <span style={{ color: '#0a0a0a', fontWeight: 700, textTransform: 'uppercase' }}>
            {product.title}
          </span>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: '3.5rem', paddingBottom: '4.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'clamp(2rem, 5vw, 5.5rem)',
            alignItems: 'start',
          }}
        >
          {/* Left: Product Gallery */}
          <div>
            {/* Main Stage Image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                backgroundColor: '#f7f6f4',
                overflow: 'hidden',
                marginBottom: '1rem',
              }}
            >
              <img
                src={selectedImage}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
              />
              {product.is_sale && discountPercent && (
                <span className="badge-sale" style={{ position: 'absolute', top: '16px', left: '16px' }}>
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[product.cover_image, product.hover_image]
                .filter(Boolean)
                .map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl as string)}
                    style={{
                      width: '80px',
                      height: '105px',
                      border: selectedImage === imgUrl ? '2px solid #b51224' : '1px solid #e7e5e3',
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      backgroundColor: '#f7f6f4',
                    }}
                  >
                    <img
                      src={imgUrl as string}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Right: Garment Information & Purchase Controls */}
          <div>
            <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.5rem' }}>
              {product.category} // YOUNG IN APPARELS
            </span>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                lineHeight: 1.15,
                color: '#0a0a0a',
                marginBottom: '1rem',
              }}
            >
              {product.title}
            </h1>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span
                style={{
                  fontSize: '1.625rem',
                  fontWeight: 900,
                  color: product.is_sale ? '#b51224' : '#0a0a0a',
                }}
              >
                {formatPrice(currentVariant ? currentVariant.price : product.price)}
              </span>
              {(currentVariant?.compare_at_price || product.compare_at_price) && (
                <span
                  style={{
                    fontSize: '1.125rem',
                    color: '#888888',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice((currentVariant?.compare_at_price || product.compare_at_price)!)}
                </span>
              )}
              {isLowStock && (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b51224' }}>
                  • Only {currentVariant.available_quantity} units remaining
                </span>
              )}
            </div>

            {/* Summary */}
            <p style={{ color: '#444444', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {product.description}
            </p>

            <div style={{ borderTop: '1px solid #f0efed', paddingTop: '1.75rem', marginBottom: '1.75rem' }}>
              {/* Colorway Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    COLORWAY: <span style={{ color: '#6b6b6b' }}>{selectedColor}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {distinctColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c.name);
                        // Pick first valid size for that color
                        const validSize = product.variants.find((v: ProductVariant) => v.color === c.name);
                        if (validSize) setSelectedSize(validSize.size);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        border: selectedColor === c.name ? '2px solid #0a0a0a' : '1px solid #e7e5e3',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: c.code,
                          border: '1px solid #ccc',
                          display: 'inline-block',
                        }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    SIZE: <span style={{ color: '#6b6b6b' }}>{selectedSize}</span>
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b51224',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Ruler size={13} />
                    <span>SIZE GUIDE</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {sizesForColor.map((s: any) => {
                    const isSelected = selectedSize === s.size;
                    const outOfStock = s.available_quantity <= 0;

                    return (
                      <button
                        key={s.size}
                        disabled={outOfStock}
                        onClick={() => setSelectedSize(s.size)}
                        style={{
                          minWidth: '50px',
                          padding: '0.75rem 1rem',
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          backgroundColor: isSelected ? '#0a0a0a' : '#ffffff',
                          color: isSelected ? '#ffffff' : outOfStock ? '#aaaaaa' : '#0a0a0a',
                          border: isSelected ? '1px solid #0a0a0a' : '1px solid #e7e5e3',
                          cursor: outOfStock ? 'not-allowed' : 'pointer',
                          textDecoration: outOfStock ? 'line-through' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Add to Bag */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #0a0a0a',
                    padding: '0 4px',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: '0.75rem 0.85rem',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={currentVariant ? quantity >= currentVariant.available_quantity : false}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: '0.75rem 0.85rem',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isCurrentOutOfStock || addingToCart}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>{isCurrentOutOfStock ? 'CURRENTLY SOLD OUT' : addingToCart ? 'ADDING...' : 'ADD TO BAG'}</span>
                </button>
              </div>

              {/* Express Checkout */}
              {!isCurrentOutOfStock && (
                <button
                  onClick={handleExpressCheckout}
                  className="btn-crimson"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '0.8125rem',
                    marginBottom: '1.75rem',
                  }}
                >
                  <Zap size={16} />
                  <span>BUY NOW (EXPRESS CHECKOUT)</span>
                </button>
              )}

              {/* Live SKU & Availability Meta */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  fontSize: '0.75rem',
                  color: '#6b6b6b',
                  borderTop: '1px solid #f0efed',
                  borderBottom: '1px solid #f0efed',
                  marginBottom: '2rem',
                }}
              >
                <span>SKU: {currentVariant?.sku || 'YIN-ARCHIVE'}</span>
                <span style={{ color: isCurrentOutOfStock ? '#b51224' : '#10b981', fontWeight: 700 }}>
                  {isCurrentOutOfStock ? 'OUT OF STOCK' : `AVAILABLE (${currentVariant?.available_quantity} IN STOCK)`}
                </span>
              </div>
            </div>

            {/* Accordion Sections */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Accordion 1: Details */}
              <div style={{ borderBottom: '1px solid #e7e5e3' }}>
                <button
                  onClick={() => toggleAccordion('details')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>GARMENT SPECIFICATIONS</span>
                  {openAccordions.details ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.details && (
                  <div style={{ paddingBottom: '1.25rem', color: '#555555', fontSize: '0.8125rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {product.details || 'Hand-finished tailored construction. Premium custom hardware and signature YoungINApparels detailing.'}
                  </div>
                )}
              </div>

              {/* Accordion 2: Craftsmanship */}
              <div style={{ borderBottom: '1px solid #e7e5e3' }}>
                <button
                  onClick={() => toggleAccordion('craftsmanship')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>FABRIC & ATELIER CARE</span>
                  {openAccordions.craftsmanship ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.craftsmanship && (
                  <div style={{ paddingBottom: '1.25rem', color: '#555555', fontSize: '0.8125rem', lineHeight: 1.8 }}>
                    {product.fabric_care || 'Dry clean with hydrocarbon solvents only. Store hanging in breathable garment bag.'}
                  </div>
                )}
              </div>

              {/* Accordion 3: Fit */}
              <div style={{ borderBottom: '1px solid #e7e5e3' }}>
                <button
                  onClick={() => toggleAccordion('fit')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>FIT & SILHOUETTE ARCHITECTURE</span>
                  {openAccordions.fit ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.fit && (
                  <div style={{ paddingBottom: '1.25rem', color: '#555555', fontSize: '0.8125rem', lineHeight: 1.8 }}>
                    {product.fit_info || 'Engineered with relaxed shoulders and tailored length. True to size for intentional editorial drape.'}
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping */}
              <div style={{ borderBottom: '1px solid #e7e5e3' }}>
                <button
                  onClick={() => toggleAccordion('shipping')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.25rem 0',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>COMPLIMENTARY SHIPPING & RETURNS</span>
                  {openAccordions.shipping ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openAccordions.shipping && (
                  <div style={{ paddingBottom: '1.25rem', color: '#555555', fontSize: '0.8125rem', lineHeight: 1.8 }}>
                    • Priority courier delivery via Bluedart / DHL Express (2-4 business days).<br />
                    • Complimentary express courier shipping on orders exceeding ₹5,000.<br />
                    • Returns accepted within 14 days of delivery in pristine, unworn condition with security tags attached.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Cross Sells */}
        {recommended.length > 0 && (
          <div style={{ marginTop: '7rem', borderTop: '1px solid #e7e5e3', paddingTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.5rem' }}>
                COMPLETE THE UNIFORM
              </span>
              <h2 style={{ fontSize: '2rem', textTransform: 'uppercase' }}>
                COMPLEMENTARY ATELIER PIECES
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '2rem',
              }}
            >
              {recommended.map((rec) => (
                <ProductCard key={rec.id} product={rec} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add To Cart Bar */}
      <div
        className="mobile-sticky-atc"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e7e5e3',
          padding: '0.75rem 1.25rem',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 850,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
            {product.title}
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 900, color: '#b51224' }}>
            {formatPrice(currentVariant ? currentVariant.price : product.price)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isCurrentOutOfStock}
          className="btn-primary"
          style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem' }}
        >
          {isCurrentOutOfStock ? 'SOLD OUT' : 'ADD TO BAG'}
        </button>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      <style>{`
        @media (max-width: 768px) {
          .mobile-sticky-atc {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};
