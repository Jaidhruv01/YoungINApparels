import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EditorialSplitProps {
  onNavigate: (path: string) => void;
}

export const EditorialSplit: React.FC<EditorialSplitProps> = ({ onNavigate }) => {
  const columns = [
    {
      title: 'DISCOVER COTTON',
      subtitle: '350GSM Brushed Combed Fleece',
      image: '/images/editorial-split.jpg',
      link: '/collections/joggers',
      cta: 'EXPLORE FLEECE',
    },
    {
      title: 'DISCOVER TECHNICAL',
      subtitle: '4-Way Poly-Nylon Architecture',
      image: '/images/lookbook-campaign.jpg',
      link: '/collections/compression',
      cta: 'EXPLORE COMPRESSION',
    },
  ];

  return (
    <section
      data-header-theme="dark"
      style={{
        width: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
      }}
    >
      {/* Section 15: Category Split - Two equal columns (Radiant items #110, #111, #112) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          width: '100%',
        }}
      >
        {columns.map((col, idx) => (
          <div
            key={col.title}
            onClick={() => onNavigate(col.link)}
            className="category-split-col"
            style={{
              position: 'relative',
              minHeight: 'clamp(500px, 75vh, 760px)',
              overflow: 'hidden',
              cursor: 'pointer',
              borderRight: idx === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(2rem, 5vw, 4rem)',
              backgroundColor: '#0a0a0a',
            }}
          >
            {/* Full-height background image with zoom on hover (Radiant item #112) */}
            <img
              src={col.image}
              alt={col.title}
              className="category-split-img"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.65) contrast(1.15)',
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
              }}
            />

            {/* Gradient shadow for text legibility */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Bottom-left Content */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '0.5rem',
                  display: 'inline-block',
                }}
              >
                {col.subtitle}
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                {col.title}
              </h2>

              {/* Text arrow shifts right on hover (Radiant item #112) */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                }}
                className="category-split-link"
              >
                <span>{col.cta}</span>
                <span className="split-arrow" style={{ display: 'inline-flex', transition: 'transform 0.25s ease' }}>
                  <ArrowRight size={15} strokeWidth={1.5} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .category-split-col:hover .category-split-img {
          transform: scale(1.06);
          filter: brightness(0.75) contrast(1.2);
        }
        .category-split-col:hover .split-arrow {
          transform: translateX(6px);
        }
      `}</style>
    </section>
  );
};
