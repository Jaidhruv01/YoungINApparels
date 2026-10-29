import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TypographyStatementProps {
  onNavigate: (path: string) => void;
}

export const TypographyStatement: React.FC<TypographyStatementProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const statementLines = [
    { text: 'ENGINEERED AT THE INTERSECTION', italic: false },
    { text: 'OF TECHNICAL PROWESS', italic: true },
    { text: '& ARCHITECTURAL SILHOUETTE.', italic: false },
  ];

  const categories = [
    {
      title: 'COMPRESSION',
      subtitle: '4-Way Poly-Nylon Base',
      image: '/images/product-bomber.jpg',
      path: '/collections/compression',
    },
    {
      title: 'HEAVYWEIGHT BOTTOMS',
      subtitle: '350GSM Combed Fleece',
      image: '/images/product-denim.jpg',
      path: '/collections/joggers',
    },
    {
      title: 'PERFORMANCE TOPS',
      subtitle: 'Ultra-Dense Drop Shoulder',
      image: '/images/product-sweater.jpg',
      path: '/collections/tanks-vests',
    },
    {
      title: 'ARCHIVE CAPSULES',
      subtitle: 'Limited Run Outerwear',
      image: '/images/product-overcoat.jpg',
      path: '/collections',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Line-by-line mask slide-up reveal on scroll (Radiant item #83)
      const validWords = wordsRef.current.filter(Boolean);
      if (validWords.length > 0) {
        gsap.fromTo(
          validWords,
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // 2. Cards fade and slide up staggered (Radiant item #87)
      const validCards = cardsRef.current.filter(Boolean);
      if (validCards.length > 0) {
        gsap.fromTo(
          validCards,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: validCards[0],
              start: 'top 85%',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      data-header-theme="light"
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: 'clamp(5rem, 9vw, 9rem) clamp(1.5rem, 5vw, 5rem)',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Large Typography Statement Section on White (Radiant items #82, #83) */}
        <div style={{ marginBottom: 'clamp(4rem, 7vw, 6.5rem)', maxWidth: '1300px' }}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#666666',
              marginBottom: '1.5rem',
            }}
          >
            ATELIER PHILOSOPHY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {statementLines.map((line, idx) => (
              <div key={idx} style={{ overflow: 'hidden' }}>
                <h2
                  ref={(el) => {
                    wordsRef.current[idx] = el;
                  }}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.02,
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  {line.italic ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        letterSpacing: '0.01em',
                        textTransform: 'none',
                        marginRight: '0.2em',
                      }}
                    >
                      {line.text}
                    </span>
                  ) : (
                    line.text
                  )}
                </h2>
              </div>
            ))}
          </div>
        </div>

        {/* Grid of Category Thumbnails (Radiant items #84, #85, #86, #87) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {categories.map((cat, index) => (
            <div
              key={cat.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              onClick={() => onNavigate(cat.path)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
              }}
              className="category-card-item"
            >
              {/* Overflow Hidden Rectangular Thumbnail */}
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
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="category-thumb-img"
                />

                {/* Arrow Icon in corner */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  <ArrowUpRight size={18} strokeWidth={1.5} />
                </div>
              </div>

              {/* Large Uppercase Label Beneath */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  {cat.title}
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#666666', marginTop: '2px' }}>
                {cat.subtitle}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .category-card-item:hover .category-thumb-img {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};
