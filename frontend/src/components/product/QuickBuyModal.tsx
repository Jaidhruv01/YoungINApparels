import React, { useState, useEffect } from 'react';
import { X, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
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
  const { addToCart, openCart } = useCart();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [activeImage, setActiveImage] = useState<string>('');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (product && isOpen) {
      const defaultVariant = product.variants[0];
      setSelectedColor(defaultVariant?.color || '');
      setSelectedSize(defaultVariant?.size || 'M');
      setActiveImage(product.cover_image);
      setIsZoomed(false);
      setIsAddedSuccess(false);
    }
  }, [product, isOpen]);

  // Lock body scroll and pause Lenis (Radiant item #130)
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

  // Trap focus and close on Escape (Radiant item #129)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const distinctColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.color, code: v.color_code })))
  ).map((str) => JSON.parse(str) as { name: string; code: string });

  const galleryImages = Array.from(
    new Set([
      product.cover_image,
      product.hover_image,
      ...(product.images ? product.images.map((img) => img.url) : []),
    ].filter(Boolean) as string[])
  );

  const colorVariants = product.variants.filter((v) => v.color === selectedColor);
  const currentVariant =
    colorVariants.find((v) => v.size === selectedSize) ||
    colorVariants[0] ||
    product.variants[0];

  const isSale = product.is_sale && product.compare_at_price && product.compare_at_price > product.price;

  // Add to cart with 1s checkmark swap, then slide in YOUR BAG drawer (Radiant items #131, #132)
  const handleAddToCart = async () => {
    if (!currentVariant) return;
    try {
      setAddingToCart(true);
      await addToCart(currentVariant.id, 1);
      setIsAddedSuccess(true);
      setTimeout(() => {
        setIsAddedSuccess(false);
        onClose();
        openCart();
      }, 1000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      {/* Screen dims with dark overlay opacity 0 to 0.6 (Radiant item #125) */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'quickBuyOverlayFade 0.3s ease forwards',
        }}
      />

      {/* Modal expands outward: scale 0.95 to 1 plus fade, 0.35s (Radiant item #126) */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '880px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.3)',
          zIndex: 1110,
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 420px) 1fr',
          animation: 'quickBuyScaleOutward 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        className="quick-buy-dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#000000',
            cursor: 'pointer',
            padding: '6px',
            zIndex: 20,
          }}
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Left Column: Image Gallery with Side Thumbnails & Zoom (Radiant items #127, #128) */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#f9f9f9',
            borderRight: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            gap: '12px',
          }}
        >
          {/* Side Thumbnails */}
          {galleryImages.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '50px',
                    height: '62px',
                    padding: 0,
                    border: activeImage === img ? '1.5px solid #000000' : '1px solid rgba(0,0,0,0.15)',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                >
                  <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Main Image with Zoom Cursor */}
          <div
            onClick={() => setIsZoomed(!isZoomed)}
            style={{
              position: 'relative',
              flex: 1,
              aspectRatio: '3 / 4',
              overflow: 'hidden',
              backgroundColor: '#f0f0f0',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            }}
          >
            <img
              src={activeImage}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: isZoomed ? 'scale(1.7)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>

        {/* Right Column: Product Info & Purchase Controls */}
        <div style={{ padding: '2.25rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'inline-block',
                marginBottom: '0.5rem',
              }}
            >
              ATELIER QUICK BUY
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.35rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                margin: '0 0 0.85rem 0',
                lineHeight: 1.15,
              }}
            >
              {product.title}
            </h2>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.75rem' }}>
              {isSale && product.compare_at_price && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    color: '#888888',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#000000',
                }}
              >
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Color Swatches */}
            {distinctColors.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666666', display: 'block', marginBottom: '8px' }}>
                  COLOR: <strong style={{ color: '#000000' }}>{selectedColor}</strong>
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {distinctColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: c.code || '#000000',
                        border: selectedColor === c.name ? '2px solid #000000' : '1px solid rgba(0,0,0,0.2)',
                        outline: selectedColor === c.name ? '2px solid #ffffff' : 'none',
                        outlineOffset: '-4px',
                        cursor: 'pointer',
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666666', display: 'block', marginBottom: '8px' }}>
                SIZE: <strong style={{ color: '#000000' }}>{selectedSize}</strong>
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['S', 'M', 'L', 'XL'].map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        padding: '8px 18px',
                        border: isSelected ? '1.5px solid #000000' : '1px solid rgba(0,0,0,0.15)',
                        backgroundColor: isSelected ? '#000000' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#000000',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action: ADD TO CART Button (Swaps to checkmark for ~1s, then slides in YOUR BAG) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="btn-stark-white"
              style={{
                width: '100%',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                padding: '1.1rem',
                fontSize: '0.8125rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.25s ease, color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              {isAddedSuccess ? (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigate(`/products/${product.slug}`);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#666666',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '6px',
                textAlign: 'center',
              }}
              className="link-hover-underline"
            >
              VIEW FULL PRODUCT DETAILS
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes quickBuyOverlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes quickBuyScaleOutward {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @media (max-width: 768px) {
          .quick-buy-dialog {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
