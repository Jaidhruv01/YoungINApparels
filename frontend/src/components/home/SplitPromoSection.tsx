import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface SplitPromoSectionProps {
  onNavigate: (path: string) => void;
}

export const SplitPromoSection: React.FC<SplitPromoSectionProps> = ({ onNavigate }) => {
  // Live countdown timer target (e.g., 2 days, 14 hours from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  const promoColumns = [
    {
      tag: '01 // SIGNATURE FIT',
      title: 'PRO-ARMOR COMPRESSION',
      subtitle: 'Sculpted muscle support with 4-way hyper-elastic poly-nylon.',
      image: '/images/product-bomber.jpg',
      cta: 'DISCOVER COMPRESSION',
      link: '/collections/compression',
    },
    {
      tag: '02 // ARCHITECTURAL FORM',
      title: '350GSM HEAVY FLEECE',
      subtitle: 'Brushed dense cotton with barbell friction panels.',
      image: '/images/product-denim.jpg',
      cta: 'DISCOVER LOWERS',
      link: '/collections/joggers',
    },
    {
      tag: '03 // ATELIER JOURNAL',
      title: 'THE DISCIPLINE MANIFESTO',
      subtitle: 'Inside our Delhi workshop: from raw fiber to functional armor.',
      image: '/images/editorial-split.jpg',
      cta: 'READ EDITORIAL',
      link: '/about',
    },
  ];

  return (
    <section data-header-theme="light" style={{ width: '100%', backgroundColor: '#ffffff' }}>
      {/* Black Horizontal Bar with Live Countdown Timer (Radiant items #88, #89) */}
      <div
        style={{
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '1.25rem clamp(1.5rem, 5vw, 4rem)',
          borderTop: '1px solid #1f1f1f',
          borderBottom: '1px solid #1f1f1f',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            LIMITED ATELIER CAPSULE // ALLOCATION CLOSING IN
          </span>
        </div>

        {/* Tabular Numerals Countdown Timer to avoid jitter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.08em',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{formatDigit(timeLeft.days)}</span>
            <span style={{ fontSize: '0.5625rem', color: '#888888', letterSpacing: '0.1em' }}>DAYS</span>
          </div>
          <span style={{ color: '#555555' }}>:</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{formatDigit(timeLeft.hours)}</span>
            <span style={{ fontSize: '0.5625rem', color: '#888888', letterSpacing: '0.1em' }}>HRS</span>
          </div>
          <span style={{ color: '#555555' }}>:</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{formatDigit(timeLeft.minutes)}</span>
            <span style={{ fontSize: '0.5625rem', color: '#888888', letterSpacing: '0.1em' }}>MIN</span>
          </div>
          <span style={{ color: '#555555' }}>:</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{formatDigit(timeLeft.seconds)}</span>
            <span style={{ fontSize: '0.5625rem', color: '#888888', letterSpacing: '0.1em' }}>SEC</span>
          </div>
        </div>
      </div>

      {/* Three-Column Split Section (Radiant items #90, #91, #92) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          width: '100%',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {promoColumns.map((col, idx) => (
          <div
            key={col.title}
            onClick={() => onNavigate(col.link)}
            className="split-promo-column"
            style={{
              position: 'relative',
              minHeight: 'clamp(440px, 65vh, 680px)',
              overflow: 'hidden',
              cursor: 'pointer',
              borderRight: idx < 2 ? '1px solid rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              backgroundColor: '#111111',
              color: '#ffffff',
            }}
          >
            {/* Background Image with Zoom */}
            <img
              src={col.image}
              alt={col.title}
              className="split-promo-img"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.72) contrast(1.1)',
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease',
              }}
            />

            {/* Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Content on top */}
            <div style={{ position: 'relative', zIndex: 5 }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '0.65rem',
                  display: 'inline-block',
                }}
              >
                {col.tag}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                  marginBottom: '0.65rem',
                }}
              >
                {col.title}
              </h3>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: '#cccccc',
                  lineHeight: 1.5,
                  maxWidth: '380px',
                  marginBottom: '1.25rem',
                }}
              >
                {col.subtitle}
              </p>

              {/* Animated Underline Link (Radiant item #92) */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
                className="link-hover-underline"
              >
                <span>{col.cta}</span>
                <ArrowRight size={13} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .split-promo-column:hover .split-promo-img {
          transform: scale(1.06);
          filter: brightness(0.8) contrast(1.15);
        }
      `}</style>
    </section>
  );
};
