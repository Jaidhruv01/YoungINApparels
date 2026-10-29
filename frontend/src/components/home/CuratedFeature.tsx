import React, { useState } from 'react';
import { Product } from '../../types';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';

interface CuratedFeatureProps {
  products: Product[];
  onNavigate: (path: string) => void;
}

export const CuratedFeature: React.FC<CuratedFeatureProps> = ({ products, onNavigate }) => {
  const { formatPrice } = useCurrency();
  const { addToCart, openCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Single product highlight (Radiant item #120)
  const highlightPiece = products.find((p) => p.slug.includes('compression')) || products[0] || {
    id: 1,
    slug: 'youngin-aero-compression-top',
    title: 'AERO TECHNICAL COMPRESSION TEE',
    price: 2499,
    description:
      'Engineered with a dense 4-way hyper-elastic poly-nylon yarn. Built with high-tensile flatlock seams to stabilize dynamic muscle oscillation during maximum load training.',
    cover_image: '/images/product-bomber.jpg',
  };

  const handleQuickAdd = async () => {
    try {
      setIsAdding(true);
      await addToCart(highlightPiece.id, 1);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        openCart();
      }, 700);
    } catch {
      onNavigate(`/products/${highlightPiece.slug}`);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff', color: '#000000' }}>
      {/* 1. Single Product Highlight (Radiant item #120) */}
      <section
        data-header-theme="light"
        style={{
          padding: 'clamp(4.5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1500px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: 'clamp(2.5rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
        >
          {/* Large Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 5',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
            }}
          >
            <img
              src={highlightPiece.cover_image}
              alt={highlightPiece.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '999px',
              }}
            >
              ATELIER HIGHLIGHT
            </div>
          </div>

          {/* Product Description & Add to Cart */}
          <div style={{ maxWidth: '540px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              SIGNATURE PIECE // 01
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              {highlightPiece.title}
            </h2>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#000000',
                marginBottom: '1.5rem',
              }}
            >
              {formatPrice(highlightPiece.price)}
            </div>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#555555',
                lineHeight: 1.65,
                marginBottom: '2.5rem',
              }}
            >
              {highlightPiece.description ||
                'High-tensile compression engineering designed to hug anatomy without friction. Cut from 4-way stretch poly-nylon that wicks moisture and preserves its form over years of rigorous discipline.'}
            </p>

            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="btn-stark-white"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '1px solid #000000',
                padding: '1.15rem 3rem',
                fontSize: '0.8125rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
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
              {added ? (
                <>
                  <Check size={16} strokeWidth={2} />
                  <span>ADDED TO CART</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Archive Edit: Asymmetrical Grid for "Refined basics" (Radiant item #121) */}
      <section
        data-header-theme="light"
        style={{
          padding: 'clamp(4.5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '3.5rem', maxWidth: '700px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              ARCHIVE EDIT // CURATED
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              REFINED{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                }}
              >
                basics
              </span>
            </h2>
          </div>

          {/* Asymmetrical Grid with Mixed Image Sizes & Overlapping Captions (Radiant item #121) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '2rem',
            }}
            className="archive-asymmetrical-grid"
          >
            {/* Tile 1: Large Wide Tile (Col 1-7) */}
            <div
              onClick={() => onNavigate('/collections/compression')}
              style={{
                gridColumn: 'span 7',
                position: 'relative',
                aspectRatio: '16 / 10',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
              }}
              className="archive-tile-hover"
            >
              <img
                src="/images/product-denim.jpg"
                alt="Refined Basics Compression"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                }}
                className="tile-img"
              />
              {/* Overlapping Caption */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  backgroundColor: '#ffffff',
                  padding: '1rem 1.5rem',
                  maxWidth: '320px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666666', marginBottom: '4px' }}>
                  EDITION 01
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  HEAVYWEIGHT FLEECE JOGGER
                </div>
              </div>
            </div>

            {/* Tile 2: Tall Vertical Tile (Col 8-12) */}
            <div
              onClick={() => onNavigate('/collections/tanks-vests')}
              style={{
                gridColumn: 'span 5',
                position: 'relative',
                aspectRatio: '4 / 5',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
              }}
              className="archive-tile-hover"
            >
              <img
                src="/images/product-sweater.jpg"
                alt="Athletic Vest"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                }}
                className="tile-img"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  backgroundColor: '#ffffff',
                  padding: '1rem 1.5rem',
                  maxWidth: '280px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666666', marginBottom: '4px' }}>
                  EDITION 02
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  ARCHITECTURAL DROP TANK
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Editorial Film / Teaser: "SOMETHING NEW IS ALMOST READY" (Radiant items #122, #123) */}
      <section
        data-header-theme="dark"
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(460px, 60vh, 650px)',
          backgroundColor: '#000000',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#ffffff',
        }}
      >
        {/* Background Film / Image with Contrast Layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <img
            src="/images/campaign-hero.jpg"
            alt="Editorial Film Teaser"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.35) contrast(1.25)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Teaser Center Text */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '850px', padding: '0 1.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
              display: 'inline-block',
              marginBottom: '1.25rem',
            }}
          >
            ATELIER PREVIEW // 2026
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 0.98,
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            SOMETHING NEW IS{' '}
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '0.01em',
                textTransform: 'none',
              }}
            >
              almost
            </span>{' '}
            READY
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#d4d4d4',
              maxWidth: '540px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            Follow our private studio drops and receive allocation priority before worldwide release.
          </p>

          <button
            onClick={() => onNavigate('/collections')}
            className="btn-stark-white"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #ffffff',
              padding: '1rem 2.5rem',
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.25s ease, color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
          >
            <span>JOIN ALLOCATION LIST</span>
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </div>
      </section>

      <style>{`
        .archive-tile-hover:hover .tile-img {
          transform: scale(1.04);
        }
        @media (max-width: 900px) {
          .archive-asymmetrical-grid {
            grid-template-columns: 1fr !important;
          }
          .archive-asymmetrical-grid > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
