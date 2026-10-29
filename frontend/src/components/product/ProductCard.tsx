import React, { useState } from 'react';
import { Product } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { QuickBuyModal } from './QuickBuyModal';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { formatPrice } = useCurrency();
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants.length > 0 ? product.variants[0].color : ''
  );

  // Group unique colors for minimal color dots (Radiant item #100)
  const distinctColors = Array.from(
    new Set(product.variants.map((v) => JSON.stringify({ name: v.color, code: v.color_code })))
  ).map((str) => JSON.parse(str));

  // Determine pricing display (Radiant item #103)
  const isSale = product.is_sale && product.compare_at_price && product.compare_at_price > product.price;

  return (
    <>
      <div
        className="radiant-product-card"
        onClick={() => setIsQuickBuyOpen(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: '#ffffff',
          userSelect: 'none',
        }}
      >
        {/* Image Container with Cross-Fade (Radiant items #100, #101) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            backgroundColor: '#f9f9f9',
            marginBottom: '0.85rem',
          }}
        >
          {/* Primary Image */}
          <img
            src={product.cover_image}
            alt={product.title}
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Secondary Lifestyle / Alternate Image Cross-Fade */}
          <img
            src={product.hover_image || product.cover_image}
            alt={`${product.title} alternate`}
            className="card-hover-image"
            loading="lazy"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0,
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* Sale or New Pill Badge (Radiant item #19: black or white pills, not red) */}
          {isSale && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
              }}
            >
              <span
                style={{
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  padding: '4px 9px',
                  borderRadius: '999px',
                  lineHeight: 1,
                  display: 'inline-block',
                }}
              >
                SALE
              </span>
            </div>
          )}
          {product.is_new && !isSale && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                zIndex: 10,
              }}
            >
              <span
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  padding: '4px 9px',
                  borderRadius: '999px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  lineHeight: 1,
                  display: 'inline-block',
                }}
              >
                NEW
              </span>
            </div>
          )}
        </div>

        {/* Minimal Color Dots (Radiant item #100) */}
        {distinctColors.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '0.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {distinctColors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                title={c.name}
                aria-label={`Select color ${c.name}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: c.code || '#000000',
                  border: selectedColor === c.name ? '1.5px solid #000000' : '1px solid rgba(0,0,0,0.2)',
                  outline: selectedColor === c.name ? '1px solid #ffffff' : 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  transform: selectedColor === c.name ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        )}

        {/* Product Title */}
        <h3
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#000000',
            margin: '0 0 0.35rem 0',
            lineHeight: 1.25,
          }}
        >
          {product.title}
        </h3>

        {/* Prices: Original struck through, new price in black (Radiant item #103) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isSale && product.compare_at_price && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: '#888888',
                textDecoration: 'line-through',
                fontWeight: 500,
              }}
            >
              {formatPrice(product.compare_at_price)}
            </span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: '#000000',
            }}
          >
            {formatPrice(product.price)}
          </span>
        </div>
      </div>

      {/* Quick Buy Modal (Radiant items #102 & #124-#130) */}
      <QuickBuyModal
        isOpen={isQuickBuyOpen}
        product={product}
        onClose={() => setIsQuickBuyOpen(false)}
        onNavigate={onNavigate}
      />

      <style>{`
        .radiant-product-card:hover .card-hover-image {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
};
