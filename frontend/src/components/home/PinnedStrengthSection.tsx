import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Shield, Activity, ShoppingBag } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface PinnedStrengthSectionProps {
  onNavigate: (path: string) => void;
  onOpenQuickBuy?: (productSlug: string) => void;
}

export const PinnedStrengthSection: React.FC<PinnedStrengthSectionProps> = ({
  onNavigate,
  onOpenQuickBuy,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);
  const bgVisualRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable ScrollTrigger pinning on desktop (>= 768px)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop || !containerRef.current || !pinSectionRef.current || !floatingCardRef.current || !bgVisualRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Create master pinning timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          pin: true,
          start: 'top top',
          end: '+=150%',
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`;
            }
          },
        },
      });

      // Entry phase (0% - 30% progress): Floating card enters from 100vw to 0, rotate 3deg -> 0deg
      // Ambient background scales from 1.0 to 1.08 across the same window
      tl.fromTo(
        floatingCardRef.current,
        {
          x: '100vw',
          rotation: 3,
          opacity: 0.8,
        },
        {
          x: '0vw',
          rotation: 0,
          opacity: 1,
          ease: 'power2.out',
          duration: 0.3, // corresponds to 0% - 30% of timeline
        },
        0
      );

      tl.fromTo(
        bgVisualRef.current,
        {
          scale: 1.0,
        },
        {
          scale: 1.08,
          ease: 'none',
          duration: 0.3,
        },
        0
      );

      // Remaining duration (30% - 100%): Card stays anchored in place with subtle breathing/spec highlights
      tl.to(
        floatingCardRef.current,
        {
          y: -15,
          ease: 'power1.inOut',
          duration: 0.7,
        },
        0.3
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenQuickBuy) {
      onOpenQuickBuy('pro-armor-seamless-compression');
    } else {
      onNavigate('/products/pro-armor-seamless-compression');
    }
  };

  return (
    <div
      ref={containerRef}
      className="pinned-strength-wrapper"
      style={{
        position: 'relative',
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* Pinned Target Section */}
      <section
        ref={pinSectionRef}
        id="series-01-strength-pin"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '680px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#050505',
          color: '#ffffff',
        }}
      >
        {/* Background Visual Container (Scales 1.0 -> 1.08) */}
        <div
          ref={bgVisualRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transformOrigin: 'center center',
            willChange: 'transform',
            zIndex: 1,
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
            alt="High Output Strength Rig"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.38) contrast(1.25) grayscale(0.2)',
            }}
          />
          {/* Subtle Industrial Grid Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(181, 18, 36, 0.18), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Top/Bottom Ambient Vignette Borders */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, #000000 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(to top, #000000 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Section Content Grid */}
        <div
          className="container-custom"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Atmospheric Typography & Mission Spec */}
          <div style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--color-campaign-red)',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px var(--color-campaign-red)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  letterSpacing: '0.2em',
                  color: 'var(--color-campaign-red)',
                  textTransform: 'uppercase',
                }}
              >
                PINNED SERIES ARCHIVE // 01
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 5.2vw, 3.75rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              SERIES 01 // HIGH-OUTPUT STRENGTH
            </h2>

            <p
              style={{
                color: '#c2c2c2',
                fontSize: 'clamp(0.875rem, 1.2vw, 1.05rem)',
                lineHeight: 1.7,
                marginBottom: '2rem',
                maxWidth: '500px',
              }}
            >
              Engineered for extreme tensile resistance and maximum kinetic output. Featuring high-density 4-way stretch poly-nylon weave with biomechanically targeted compression panels.
            </p>

            {/* Performance Specifications Badges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1rem',
                marginBottom: '2.5rem',
              }}
            >
              <div
                style={{
                  borderLeft: '2px solid var(--color-campaign-red)',
                  paddingLeft: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffffff', marginBottom: '2px' }}>
                  <Zap size={14} color="var(--color-campaign-red)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>320 GSM</span>
                </div>
                <span style={{ fontSize: '0.625rem', color: '#888888', textTransform: 'uppercase' }}>
                  High-Tensile Weave
                </span>
              </div>

              <div
                style={{
                  borderLeft: '2px solid rgba(255, 255, 255, 0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffffff', marginBottom: '2px' }}>
                  <Activity size={14} color="#ffffff" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>4-WAY POLY-NYLON</span>
                </div>
                <span style={{ fontSize: '0.625rem', color: '#888888', textTransform: 'uppercase' }}>
                  Microfiber Recovery
                </span>
              </div>

              <div
                style={{
                  borderLeft: '2px solid rgba(255, 255, 255, 0.25)',
                  paddingLeft: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffffff', marginBottom: '2px' }}>
                  <Shield size={14} color="#ffffff" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>FLATLOCK 4-NEEDLE</span>
                </div>
                <span style={{ fontSize: '0.625rem', color: '#888888', textTransform: 'uppercase' }}>
                  Zero Chafing Seams
                </span>
              </div>
            </div>

            {/* Scroll Lock Timeline Indicator */}
            <div style={{ maxWidth: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: '#888888', marginBottom: '6px' }}>
                <span>SCROLL TIMELINE SYNC</span>
                <span style={{ color: 'var(--color-campaign-red)' }}>PINNED LOCK</span>
              </div>
              <div style={{ width: '100%', height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  ref={progressBarRef}
                  style={{
                    width: '0%',
                    height: '100%',
                    backgroundColor: 'var(--color-campaign-red)',
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Floating Product Card ("PRO-ARMOR SEAMLESS COMPRESSION") */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              ref={floatingCardRef}
              className="pinned-floating-card"
              style={{
                width: '100%',
                maxWidth: '430px',
                backgroundColor: 'rgba(16, 16, 16, 0.88)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '3px',
                padding: '1.75rem',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(181, 18, 36, 0.15)',
                willChange: 'transform, opacity',
                transformOrigin: 'bottom right',
              }}
            >
              {/* Product Badge Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    backgroundColor: 'var(--color-campaign-red)',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  FEATURED ARTIFACT
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    color: '#888888',
                    letterSpacing: '0.1em',
                  }}
                >
                  SPEC // YIN-01-PRO
                </span>
              </div>

              {/* Product Image Frame */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/4.5',
                  backgroundColor: '#0a0a0a',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  marginBottom: '1.25rem',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=85"
                  alt="PRO-ARMOR SEAMLESS COMPRESSION"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="pinned-product-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 8px',
                    borderRadius: '2px',
                    fontSize: '0.625rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  DYNAMIC MUSCLE LOCK
                </div>
              </div>

              {/* Title & Price */}
              <div style={{ marginBottom: '1rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    lineHeight: 1.25,
                    marginBottom: '4px',
                  }}
                >
                  PRO-ARMOR SEAMLESS COMPRESSION
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                    {formatPrice(1899)}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#777777', textDecoration: 'line-through' }}>
                    {formatPrice(2499)}
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--color-campaign-red)' }}>
                    SAVE 24%
                  </span>
                </div>
              </div>

              {/* Quick Specs List */}
              <p style={{ fontSize: '0.8125rem', color: '#9e9e9e', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                High-pressure poly-nylon compression with thermo-regulating breathability channels. Designed for zero slippage during heavy lifts.
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleQuickAdd}
                  className="btn-crimson"
                  style={{
                    flex: 1,
                    padding: '0.85rem 1rem',
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  <ShoppingBag size={14} />
                  <span>ACQUIRE ARTIFACT</span>
                </button>
                <button
                  onClick={() => onNavigate('/products/pro-armor-seamless-compression')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                  title="View complete specifications"
                  aria-label="View specifications"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .pinned-product-img:hover {
          transform: scale(1.05);
        }
        @media (max-width: 768px) {
          .pinned-strength-wrapper #series-01-strength-pin {
            height: auto !important;
            min-height: auto !important;
            padding: 4rem 0 !important;
          }
          .pinned-strength-wrapper .container-custom {
            grid-template-columns: 1fr !important;
            gap: 2.25rem !important;
          }
          .pinned-floating-card {
            transform: none !important;
            opacity: 1 !important;
            max-width: 100% !important;
            padding: 1.25rem !important;
          }
          .pinned-floating-card h3 {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
