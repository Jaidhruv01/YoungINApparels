import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { CMSSection } from '../../types';
import { MaskedRevealHeader } from '../common/MaskedRevealHeader';

interface CampaignHeroProps {
  cmsData?: CMSSection | null;
  onNavigate: (path: string) => void;
}

interface HeroHotspot {
  id: string;
  tag: string;
  title: string;
  fabric: string;
  price: string;
  xPercent: number;
  yPercent: number;
  link: string;
}

export const CampaignHero: React.FC<CampaignHeroProps> = ({ cmsData, onNavigate }) => {
  const subtitle =
    cmsData?.subtitle ||
    'High-performance activewear built for high-intensity training. Featuring our signature 4-way stretch poly-nylon compression wear and heavy-duty 350GSM training joggers.';
  const ctaText = cmsData?.cta_text || 'SHOP THE DROP';
  const ctaLink = cmsData?.cta_link || '/collections/compression';
  const image = cmsData?.image_url || '/images/campaign-hero.jpg';

  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const parallaxRef = React.useRef<HTMLDivElement>(null);

  // Parallax Motion: translates down at 0.3x scroll velocity via RAF without React re-renders
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (parallaxRef.current && window.scrollY < window.innerHeight * 1.5) {
            parallaxRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.3}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroHotspots: HeroHotspot[] = [
    {
      id: 'hotspot-compression',
      tag: 'CORE ARMOR',
      title: 'PRO-ARMOR COMPRESSION TEE',
      fabric: '4-Way Stretch Poly-Nylon • Flatlock Seams',
      price: '₹2,499',
      xPercent: 64,
      yPercent: 42,
      link: '/collections/compression',
    },
    {
      id: 'hotspot-jogger',
      tag: 'HEAVYWEIGHT 350GSM',
      title: '350GSM HEAVYWEIGHT LOWER',
      fabric: 'Brushed Combed Fleece • Deadlift Barbell Panels',
      price: '₹3,499',
      xPercent: 71,
      yPercent: 72,
      link: '/collections/350gsm-lowers',
    },
  ];

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minHeight: 'clamp(620px, 90vh, 940px)',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Media with Parallax Motion (0.3x velocity) */}
      <div
        ref={parallaxRef}
        style={{
          position: 'absolute',
          inset: '-5% 0 0 0',
          zIndex: 1,
          willChange: 'transform',
          transform: 'translate3d(0, 0px, 0)',
        }}
      >
        <img
          src={image}
          alt="YoungIN Technical Performance Campaign"
          style={{
            width: '100%',
            height: '110%',
            objectFit: 'cover',
            objectPosition: 'center 22%',
            filter: 'brightness(0.88) contrast(1.08)',
          }}
        />

        {/* Ambient Media Dark Radial Gradient Overlay for text contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 65% 45%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Bottom Vignette Bleed */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.95) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Floating Campaign Badge Top Right */}
      <div
        className="hero-badge-floating"
        style={{
          position: 'absolute',
          top: '2.5rem',
          right: 'clamp(1rem, 4vw, 3.5rem)',
          zIndex: 15,
          backgroundColor: 'rgba(14, 14, 14, 0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '0.65rem 1.25rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-campaign-red)',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          STRENGTH DROP // 01 — CRAFTED IN INDIA
        </span>
      </div>

      {/* Interactive Hotspot Pins on Hero Imagery */}
      <div className="hero-hotspots-layer" style={{ position: 'absolute', inset: 0, zIndex: 12, pointerEvents: 'none' }}>
        {heroHotspots.map((pin) => {
          const isActive = activeHotspotId === pin.id;

          return (
            <div
              key={pin.id}
              className={`hotspot-pin ${isActive ? 'is-active' : ''}`}
              style={{
                left: `${pin.xPercent}%`,
                top: `${pin.yPercent}%`,
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setActiveHotspotId(pin.id)}
              onMouseLeave={() => setActiveHotspotId(null)}
              onClick={() => onNavigate(pin.link)}
            >
              {/* Idle Pulse Ring */}
              <div className="hotspot-ring" />
              {/* Center Dot */}
              <div className="hotspot-center" />

              {/* Connecting Line Vector */}
              <svg className="hotspot-connecting-line" width="40" height="2" viewBox="0 0 40 2">
                <line x1="0" y1="1" x2="40" y2="1" className="hotspot-connecting-path" />
              </svg>

              {/* Floating Glass Card Expansion Adjacent to Pin */}
              <div className="hotspot-glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: 'var(--color-campaign-red)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {pin.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#ffffff' }}>
                    {pin.price}
                  </span>
                </div>
                <h4
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    lineHeight: 1.25,
                    marginBottom: '4px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {pin.title}
                </h4>
                <p style={{ fontSize: '0.6875rem', color: '#aaaaaa', lineHeight: 1.4, marginBottom: '8px' }}>
                  {pin.fabric}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 800 }}>
                  <span>VIEW SPECIFICATION</span>
                  <ArrowRight size={11} color="var(--color-campaign-red)" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Content & Masked Split Typography Reveal */}
      <div
        className="container-custom"
        style={{
          position: 'relative',
          zIndex: 14,
          paddingBottom: 'clamp(3rem, 6vw, 5.5rem)',
          paddingTop: 'clamp(4rem, 8vw, 6rem)',
          color: '#ffffff',
          maxWidth: '920px',
        }}
      >
        <MaskedRevealHeader
          as="h1"
          tag="HIGH-PERFORMANCE GYMWEAR // INDIA"
          lines={['ENGINEERED FOR', 'THE GRIND']}
          italicSuffix="Archive 01"
          staggerDelay={0.08}
          style={{
            fontSize: 'clamp(1.75rem, 6.5vw, 5.5rem)',
            color: '#ffffff',
            marginBottom: '1.5rem',
            lineHeight: 1.12,
          }}
        />

        <p
          style={{
            fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)',
            color: '#d4d4d4',
            maxWidth: '640px',
            lineHeight: 1.65,
            marginBottom: '2.25rem',
          }}
        >
          {subtitle}
        </p>

        <div className="hero-actions-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate(ctaLink)}
            className="btn-crimson"
            style={{
              padding: '1.05rem 2.25rem',
              fontSize: '0.8125rem',
            }}
          >
            <span>{ctaText}</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => onNavigate('/collections/joggers')}
            className="btn-white"
            style={{
              padding: '1.05rem 2rem',
              fontSize: '0.8125rem',
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderColor: 'rgba(255,255,255,0.25)',
              color: '#ffffff',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <Eye size={16} />
            <span>EXPLORE JOGGERS (350GSM)</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-hotspots-layer {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .hero-badge-floating {
            top: 1rem !important;
            left: 1rem !important;
            right: auto !important;
            max-width: calc(100% - 2rem) !important;
            padding: 0.4rem 0.8rem !important;
          }
          .hero-badge-floating span:last-child {
            font-size: 0.58rem !important;
            letter-spacing: 0.1em !important;
          }
          .hero-actions-container {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
          }
          .hero-actions-container button {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
};
