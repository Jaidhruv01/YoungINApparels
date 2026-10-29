import React, { useState } from 'react';
import { ShoppingBag, Heart, Check, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { QuickBuyModal } from './QuickBuyModal';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedColor, setSelectedColor] = useState(
    product.variants.length > 0 ? product.variants[0].color : ''
  );
  const [addingVariantId, setAddingVariantId] = useState<number | null>(null);
  const [mobileQuickAddOpen, setMobileQuickAddOpen] = useState(false);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);

  // Group variants by color
  const distinctColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.color, code: v.color_code })))
  ).map((str) => JSON.parse(str));

  // Variants filtered by current selected color
  const colorVariants = product.variants.filter((v) => v.color === selectedColor);

  const handleQuickAdd = async (e: React.MouseEvent, variantId: number) => {
    e.stopPropagation();
    try {
      setAddingVariantId(variantId);
      await addToCart(variantId, 1);
      setMobileQuickAddOpen(false);
    } finally {
      setAddingVariantId(null);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id, product.title);
  };

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : null;

  const wishlisted = isWishlisted(product.id);

  return (
    <div
      className="product-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: '#ffffff',
      }}
      onClick={() => onNavigate(`/products/${product.slug}`)}
    >
      {/* Image Container with Dual Image Stack */}
      <div className="product-image-container">
        <img
          src={product.cover_image}
          alt={product.title}
          className="product-image-primary"
          loading="lazy"
        />
        <img
          src={product.hover_image || product.cover_image}
          alt={`${product.title} technical fit view`}
          className="product-image-hover"
          loading="lazy"
        />

        {/* Left Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 10,
          }}
        >
          {product.is_sale && discountPercent && (
            <span className="badge-sale">
              SAVE {discountPercent}%
            </span>
          )}
          {product.is_new && !product.is_sale && (
            <span className="badge-new">
              NEW RELEASE
            </span>
          )}
        </div>

        {/* Action Buttons Top Right: Quick View & Wishlist */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Wishlist Heart Button */}
          <button
            onClick={handleHeartClick}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: wishlisted ? 'var(--color-campaign-red)' : 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            className="wishlist-btn-card"
          >
            <Heart
              size={16}
              color={wishlisted ? '#ffffff' : '#0a0a0a'}
              fill={wishlisted ? '#ffffff' : 'none'}
            />
          </button>

          {/* Quick Buy / Inspect Modal Trigger Button */}
          <button
            onClick={() => setIsQuickBuyOpen(true)}
            aria-label="Quick inspect modal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              color: '#0a0a0a',
            }}
            className="quick-view-btn-card"
            title="Quick Acquisition Modal"
          >
            <Eye size={15} />
          </button>
        </div>

        {/* Quick-Buy Slide-Up Overlay (Radian Style) */}
        <div
          className="quick-add-bar desktop-quick-bar"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e5e5e5' }}>
              SELECT SIZE FOR QUICK-BUY
            </span>
            <ShoppingBag size={13} color="var(--color-campaign-red)" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['S', 'M', 'L', 'XL'].map((sizeKey) => {
              const matchingVariant =
                colorVariants.find((v) => v.size.toUpperCase() === sizeKey) ||
                product.variants.find((v) => v.size.toUpperCase() === sizeKey);

              const isOutOfStock = !matchingVariant || matchingVariant.available_quantity <= 0;
              const isAdding = matchingVariant ? addingVariantId === matchingVariant.id : false;

              return (
                <button
                  key={sizeKey}
                  className="quick-buy-size-btn"
                  disabled={isOutOfStock || isAdding}
                  onClick={(e) => matchingVariant && handleQuickAdd(e, matchingVariant.id)}
                  title={isOutOfStock ? `${sizeKey} Sold Out` : `Stock: ${matchingVariant?.available_quantity || 0}`}
                >
                  {isAdding ? '...' : sizeKey}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Quick-Buy Trigger Button (Bottom Right of Image) */}
        <button
          className="mobile-quick-buy-btn"
          onClick={(e) => {
            e.stopPropagation();
            setMobileQuickAddOpen(!mobileQuickAddOpen);
          }}
          aria-label="Quick buy options"
        >
          <ShoppingBag size={15} />
        </button>

        {/* Mobile Quick-Add Drawer Overlay */}
        {mobileQuickAddOpen && (
          <div
            className="mobile-quick-selector"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff' }}>
                SELECT SIZE
              </span>
              <button
                onClick={() => setMobileQuickAddOpen(false)}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.625rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {colorVariants.map((v) => {
                const outOfStock = v.available_quantity <= 0;
                return (
                  <button
                    key={v.id}
                    disabled={outOfStock || addingVariantId === v.id}
                    onClick={(e) => handleQuickAdd(e, v.id)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: outOfStock ? '#333' : '#fff',
                      color: outOfStock ? '#666' : '#0a0a0a',
                      border: 'none',
                      borderRadius: '2px',
                    }}
                  >
                    {addingVariantId === v.id ? '..' : v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Meta Content */}
      <div style={{ paddingTop: '0.875rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Color Swatches */}
        {distinctColors.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '4px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {distinctColors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: c.code,
                  border: selectedColor === c.name ? '2px solid #b51224' : '1px solid #cccccc',
                  padding: 0,
                  cursor: 'pointer',
                  outline: 'none',
                }}
                title={c.name}
                aria-label={`Select color ${c.name}`}
              />
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
          <h3
            style={{
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#111111',
              lineHeight: 1.35,
              flex: 1,
            }}
          >
            {product.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 800,
              color: product.is_sale ? 'var(--color-campaign-red)' : '#111111',
            }}
          >
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#6b6b6b',
                textDecoration: 'line-through',
              }}
            >
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>

      <style>{`
        .mobile-quick-buy-btn {
          display: none;
        }
        .mobile-quick-selector {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-quick-bar {
            display: none !important;
          }
          .mobile-quick-buy-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            bottom: 8px;
            right: 8px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(10, 10, 10, 0.9);
            color: #ffffff;
            border: none;
            z-index: 12;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          }
          .mobile-quick-selector {
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.96);
            backdrop-filter: blur(8px);
            padding: 8px;
            z-index: 20;
          }
        }
      `}</style>

      {/* Section 8: Quick Buy Modal & Swatch Micro-Interactions */}
      <QuickBuyModal
        isOpen={isQuickBuyOpen}
        product={product}
        onClose={() => setIsQuickBuyOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
