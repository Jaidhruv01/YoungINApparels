import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Check, Zap, ShieldCheck } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { smoothScrollEngine } from '../../utils/smoothScroll';

interface QuickBuyModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const QuickBuyModal: React.FC<QuickBuyModalProps> = ({
  isOpen,
  product,
  onClose,
  onNavigate,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [imageFading, setImageFading] = useState<boolean>(false);
  const [swatchBouncing, setSwatchBouncing] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);

  // Initialize selected color & size when product opens
  useEffect(() => {
    if (product && isOpen) {
      const defaultVariant = product.variants[0];
      const initialColor = defaultVariant?.color || '';
      setSelectedColor(initialColor);
      setSelectedSize(defaultVariant?.size || 'M');
      setActiveImage(product.cover_image);
      setQuantity(1);
    }
  }, [product, isOpen]);

  // Lock body scroll with Lenis width compensation
  useEffect(() => {
    if (isOpen) {
      smoothScrollEngine.lockScroll();
    } else {
      smoothScrollEngine.unlockScroll();
    }
    return () => {
      smoothScrollEngine.unlockScroll();
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Distinct colors
  const distinctColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.color, code: v.color_code })))
  ).map((str) => JSON.parse(str) as { name: string; code: string });

  // Sizes for selected color
  const colorVariants = product.variants.filter((v) => v.color === selectedColor);
  const currentVariant =
    colorVariants.find((v) => v.size === selectedSize) ||
    colorVariants[0] ||
    product.variants[0];

  const galleryImages = Array.from(
    new Set([
      product.cover_image,
      product.hover_image,
      ...(product.images ? product.images.map((img) => img.url) : []),
    ].filter(Boolean) as string[])
  );

  // Handle swatch selection with scale bounce & outline pop
  const handleSelectColor = (colorName: string) => {
    setSwatchBouncing(colorName);
    setSelectedColor(colorName);
    const matching = product.variants.find((v) => v.color === colorName);
    if (matching) setSelectedSize(matching.size);

    setTimeout(() => {
      setSwatchBouncing(null);
    }, 350);
  };

  // Thumbnail click: Main image swap with 200ms opacity cross-fade (0.3 -> 1.0)
  const handleSelectImage = (imgUrl: string) => {
    if (imgUrl === activeImage) return;
    setImageFading(true);
    setTimeout(() => {
      setActiveImage(imgUrl);
      setImageFading(false);
    }, 200);
  };

  const handleAddToCart = async () => {
    if (!currentVariant) return;
    try {
      setAddingToCart(true);
      await addToCart(currentVariant.id, quantity);
      onClose();
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const isOutOfStock = !currentVariant || currentVariant.available_quantity <= 0;

  return (
    <div
      className="quick-buy-modal-root"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Modal Overlay Physics: blur(0px) -> blur(16px), opacity: 0 -> 1 over 250ms ease */}
      <div
        className="quick-buy-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'backdrop-filter 250ms ease, opacity 250ms ease',
          opacity: 1,
        }}
      />

      {/* Modal Inner Wrapper: scale(0.94) translateY(16px) -> scale(1.0) translateY(0) over 350ms cubic-bezier(0.16, 1, 0.3, 1) */}
      <div
        className="quick-buy-card-wrapper"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0d0d0d',
          color: '#ffffff',
          borderRadius: '3px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(181, 18, 36, 0.2)',
          zIndex: 1060,
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 380px) 1fr',
          animation: 'quickBuyScaleIn 350ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            transition: 'background-color 0.2s ease',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Left Column: Image Gallery & Cross-Fade Swap */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#090909',
            borderRight: '1px solid #1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Main Visual with Cross-Fade Opacity (0.3 -> 1.0 over 200ms) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3/4',
              backgroundColor: '#141414',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <img
              src={activeImage}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageFading ? 0.3 : 1.0,
                transition: 'opacity 200ms ease-in-out',
              }}
            />
            {product.is_sale && (
              <span
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'var(--color-campaign-red)',
                  color: '#ffffff',
                  fontSize: '0.625rem',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  padding: '3px 8px',
                  borderRadius: '2px',
                }}
              >
                SALE
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {galleryImages.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectImage(img)}
                  style={{
                    width: '54px',
                    height: '68px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: activeImage === img ? '2px solid var(--color-campaign-red)' : '1px solid #2a2a2a',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                    backgroundColor: '#111111',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Spec Details, Swatches & Quick Add */}
        <div className="quick-buy-details-col" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Category Eyebrow */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: 'var(--color-campaign-red)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              QUICK ACQUISITION // {product.category.toUpperCase()}
            </span>

            {/* Product Title */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#ffffff',
                lineHeight: 1.25,
                marginBottom: '0.75rem',
                wordBreak: 'break-word',
              }}
            >
              {product.title}
            </h2>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>
                {formatPrice(currentVariant?.price || product.price)}
              </span>
              {(currentVariant?.compare_at_price || product.compare_at_price) && (
                <span style={{ fontSize: '0.9375rem', color: '#666666', textDecoration: 'line-through' }}>
                  {formatPrice(currentVariant?.compare_at_price || product.compare_at_price!)}
                </span>
              )}
              {isOutOfStock && (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-campaign-red)' }}>
                  OUT OF STOCK
                </span>
              )}
            </div>

            {/* Color Swatches with Scale Bounce & Outline Ring Pop */}
            {distinctColors.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#888888',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  COLORWAY: <strong style={{ color: '#ffffff' }}>{selectedColor}</strong>
                </span>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {distinctColors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    const isBouncing = swatchBouncing === c.name;

                    return (
                      <button
                        key={c.name}
                        onClick={() => handleSelectColor(c.name)}
                        className={`swatch-btn ${isSelected ? 'selected' : ''} ${isBouncing ? 'bounce' : ''}`}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: c.code,
                          border: '2px solid #000000',
                          // Color Swatch Highlight: instant outline ring pop (box-shadow: 0 0 0 2px #FFFFFF)
                          boxShadow: isSelected ? '0 0 0 2px #FFFFFF' : '0 0 0 1px #333333',
                          cursor: 'pointer',
                          padding: 0,
                          // Subtle spring scale bounce: scale(0.9) -> scale(1.05) -> scale(1.0)
                          transform: isBouncing
                            ? 'scale(1.05)'
                            : isSelected
                            ? 'scale(1.0)'
                            : 'scale(0.95)',
                          transition: 'transform 200ms cubic-bezier(0.175, 0.885, 0.32, 1.2), box-shadow 150ms ease',
                        }}
                        title={c.name}
                        aria-label={`Select colorway ${c.name}`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#888888',
                  }}
                >
                  SIZE: <strong style={{ color: '#ffffff' }}>{selectedSize}</strong>
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#888888' }}>
                  Available: {currentVariant?.available_quantity || 0}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {colorVariants.map((v) => {
                  const isSelected = selectedSize === v.size;
                  const outOfStock = v.available_quantity <= 0;

                  return (
                    <button
                      key={v.id}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(v.size)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.04em',
                        border: isSelected
                          ? '1px solid var(--color-campaign-red)'
                          : '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: isSelected
                          ? 'var(--color-campaign-red)'
                          : outOfStock
                          ? '#181818'
                          : '#111111',
                        color: outOfStock ? '#555555' : '#ffffff',
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                        borderRadius: '2px',
                        transition: 'all 0.18s ease',
                        textDecoration: outOfStock ? 'line-through' : 'none',
                      }}
                    >
                      {v.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technical Spec Snippet */}
            <p style={{ fontSize: '0.8125rem', color: '#9e9e9e', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.fabric_care || 'Crafted from high-tensile 4-way stretch poly-nylon. Biomechanically engineered for heavy resistance training and zero restriction.'}
            </p>
          </div>

          {/* Action Row */}
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              {/* Quantity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#141414',
                  border: '1px solid #2a2a2a',
                  borderRadius: '2px',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 8px', fontSize: '0.875rem', fontWeight: 800 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={currentVariant ? quantity >= currentVariant.available_quantity : false}
                  style={{
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart}
                className="btn-crimson"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '0.8125rem',
                  letterSpacing: '0.12em',
                }}
              >
                <ShoppingBag size={16} />
                <span>{isOutOfStock ? 'OUT OF STOCK' : addingToCart ? 'ADDING...' : 'ADD TO BAG'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigate(`/products/${product.slug}`);
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: '#888888',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '4px',
                transition: 'color 0.2s ease',
              }}
            >
              <span>VIEW COMPLETE ATHLETE SPECIFICATIONS</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes quickBuyScaleIn {
          0% {
            transform: scale(0.94) translateY(16px);
            opacity: 0;
          }
          100% {
            transform: scale(1.0) translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .quick-buy-card-wrapper {
            grid-template-columns: 1fr !important;
            max-height: 85vh !important;
          }
          .quick-buy-details-col {
            padding: 1.25rem 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
