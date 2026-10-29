import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

interface PinnedStrengthSectionProps {
  onNavigate: (path: string) => void;
  onOpenQuickBuy?: (productId: string) => void;
}

export const PinnedStrengthSection: React.FC<PinnedStrengthSectionProps> = ({
  onNavigate,
  onOpenQuickBuy,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const productCardRef = useRef<HTMLDivElement>(null);

  const featuredProduct = {
    id: 1,
    slug: 'youngin-aero-compression-top',
    title: 'CALM COMPRESSION PULLOVER',
    subtitle: '4-Way Poly-Nylon • Oxblood Edition',
    price: 2499,
    image: '/images/product-bomber.jpg',
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !productCardRef.current) return;

      // 1. Horizontal Slide-in Card over background: x 100% to 0, 1s, power3.out (Radiant item #107)
      gsap.fromTo(
        productCardRef.current,
        { x: '120%', opacity: 0 },
        {
          x: '0%',
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 2. Gentle Background Parallax: yPercent 0 to 15 (Radiant item #109)
      if (bgImageRef.current) {
        gsap.fromTo(
          bgImageRef.current,
          { yPercent: -5, scale: 1.05 },
          {
            yPercent: 12,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(featuredProduct.id, 1);
    } catch {
      onNavigate(`/products/${featuredProduct.slug}`);
    }
  };

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(550px, 85vh, 850px)',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Oxblood Ambient Background Image with Gentle Parallax (Radiant items #105, #109) */}
      <div
        style={{
          position: 'absolute',
          inset: '-10% 0',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        <img
          ref={bgImageRef}
          src="/images/campaign-hero.jpg"
          alt="Oxblood Featured Collection"
          style={{
            width: '100%',
            height: '120%',
            objectFit: 'cover',
            filter: 'brightness(0.45) contrast(1.2)',
          }}
        />

        {/* Deep Oxblood Accent Layer (#800000 at 35% opacity) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(128, 0, 0, 0.38)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient Dark Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Main Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 clamp(1.5rem, 5vw, 5rem)',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3rem',
        }}
      >
        {/* Left: Atmospheric Text Overlays "TIMELESS STYLE" (Radiant item #106) */}
        <div style={{ maxWidth: '640px', color: '#ffffff' }}>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#800000',
                border: '1px solid rgba(255,255,255,0.6)',
              }}
            />
            FEATURED CAPSULE // OXBLOOD ACCENT
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.8rem, 6.5vw, 6rem)',
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            TIMELESS{' '}
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '0.01em',
                textTransform: 'none',
              }}
            >
              sculpture
            </span>
          </h2>

          <p
            style={{
              fontSize: '1rem',
              color: '#d4d4d4',
              lineHeight: 1.65,
              maxWidth: '520px',
              marginBottom: '2.5rem',
            }}
          >
            Restricted drop featuring deep oxblood hues, hyper-dense stitching, and high-tensile recovery fabrics made to move with unyielding grace.
          </p>

          <button
            onClick={() => onNavigate('/collections/compression')}
            className="btn-stark-white"
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              border: '1px solid #ffffff',
              padding: '1rem 2.25rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.10em',
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
            <span>EXPLORE CAPSULE</span>
            <ArrowRight size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Right: Floating Product Card sliding horizontally from right (Radiant items #107, #108) */}
        <div
          ref={productCardRef}
          onClick={() => onNavigate(`/products/${featuredProduct.slug}`)}
          style={{
            width: '100%',
            maxWidth: '380px',
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '1.25rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            cursor: 'pointer',
            willChange: 'transform, opacity',
          }}
        >
          {/* Card Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 4',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              marginBottom: '1rem',
            }}
          >
            <img
              src={featuredProduct.image}
              alt={featuredProduct.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
            />
            {/* Oxblood pill badge */}
            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
              <span
                style={{
                  backgroundColor: '#800000',
                  color: '#ffffff',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 8px',
                  borderRadius: '999px',
                }}
              >
                SPECIAL RUN
              </span>
            </div>
          </div>

          {/* Title & Price */}
          <h3
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: '0 0 0.25rem 0',
            }}
          >
            {featuredProduct.title}
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#666666', margin: '0 0 0.85rem 0' }}>
            {featuredProduct.subtitle}
          </p>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '1.25rem',
            }}
          >
            {formatPrice(featuredProduct.price)}
          </div>

          {/* Add to Cart Stark Button (Radiant item #108) */}
          <button
            onClick={handleAddToCart}
            style={{
              width: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              padding: '0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.10em',
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
            <ShoppingBag size={14} strokeWidth={1.5} />
            <span>ADD TO CART</span>
          </button>
        </div>
      </div>
    </section>
  );
};
