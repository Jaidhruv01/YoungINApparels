import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { CMSSection } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface CampaignHeroProps {
  cmsData?: CMSSection | null;
  onNavigate: (path: string) => void;
  onOpenQuickBuy?: (productId?: string) => void;
}

interface HeroHotspot {
  id: string;
  productId: string;
  title: string;
  price: string;
  xPercent: number;
  yPercent: number;
  link: string;
}

export const CampaignHero: React.FC<CampaignHeroProps> = ({ cmsData, onNavigate, onOpenQuickBuy }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const textLineRefs = useRef<(HTMLElement | null)[]>([]);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  const heroImage = cmsData?.image_url || '/images/campaign-hero.jpg';

  const hotspots: HeroHotspot[] = [
    {
      id: 'hotspot-1',
      productId: 'youngin-aero-compression-top',
      title: 'PRO-ARMOR COMPRESSION',
      price: '₹2,499',
      xPercent: 62,
      yPercent: 44,
      link: '/collections/compression',
    },
    {
      id: 'hotspot-2',
      productId: 'youngin-350gsm-heavyweight-lower',
      title: '350GSM HEAVYWEIGHT LOWER',
      price: '₹3,499',
      xPercent: 68,
      yPercent: 74,
      link: '/collections/joggers',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text reveal on load: each line masked and sliding up (y: 100% to 0, stagger 0.1s, ease power4.out)
      const validLines = textLineRefs.current.filter(Boolean);
      if (validLines.length > 0) {
        gsap.fromTo(
          validLines,
          { y: '105%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
            delay: 0.2,
          }
        );
      }

      // 2. Parallax: hero image moves slower than scroll (yPercent 0 to 20 with ScrollTrigger scrub)
      if (imageRef.current && containerRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: 0, scale: 1.04 },
          {
            yPercent: 18,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleHotspotClick = (spot: HeroHotspot) => {
    if (onOpenQuickBuy) {
      onOpenQuickBuy(spot.productId);
    } else {
      onNavigate(spot.link);
    }
  };

  return (
    <section
      ref={containerRef}
      data-header-theme="dark"
      style={{
        position: 'relative',
        width: '100%',
        height: '100svh',
        minHeight: '680px',
        backgroundColor: '#000000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Parallax Background Container */}
      <div
        style={{
          position: 'absolute',
          inset: '-8% 0 0 0',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <img
          ref={imageRef}
          src={heroImage}
          alt="Youngin Atelier Campaign"
          style={{
            width: '100%',
            height: '116%',
            objectFit: 'cover',
            objectPosition: 'center 28%',
            filter: 'brightness(0.85) contrast(1.12)',
            transformOrigin: 'center center',
          }}
        />

        {/* Ambient Dark Gradients */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '240px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 40%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Interactive Hotspots Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {hotspots.map((spot) => {
          const isHovered = hoveredHotspot === spot.id;

          return (
            <div
              key={spot.id}
              style={{
                position: 'absolute',
                left: `${spot.xPercent}%`,
                top: `${spot.yPercent}%`,
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              onMouseEnter={() => setHoveredHotspot(spot.id)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={() => handleHotspotClick(spot)}
              aria-label={`View ${spot.title}`}
            >
              {/* Hotspot Pulse Circle (Radiant items #66 & #67) */}
              <div
                style={{
                  position: 'relative',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* 2s Pulse Ring */}
                <span
                  style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: '1.5px solid #ffffff',
                    animation: 'hotspotPulseRing 2s cubic-bezier(0.25, 1, 0.5, 1) infinite',
                    pointerEvents: 'none',
                  }}
                />
                {/* Center White Dot */}
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                    display: 'block',
                  }}
                />
              </div>

              {/* Extending Line on Hover (0 to 60px) + Sliding Label (Radiant item #68) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                {/* Connecting Line */}
                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    width: isHovered ? '60px' : '0px',
                    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Sliding Text Label */}
                <div
                  style={{
                    paddingLeft: '10px',
                    whiteSpace: 'nowrap',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateX(0px)' : 'translateX(-12px)',
                    transition: 'opacity 0.35s ease 0.15s, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                    }}
                  >
                    {spot.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#e0e0e0',
                      letterSpacing: '0.05em',
                      textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                    }}
                  >
                    {spot.price}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Massive Left-Aligned Hero Content (Radiant items #23, #25, #26, #64, #71) */}
      <div
        style={{
          position: 'relative',
          zIndex: 12,
          padding: '0 clamp(1.5rem, 5vw, 5rem)',
          paddingTop: 'calc(64px + 32px + 2rem)',
          paddingBottom: 'clamp(3rem, 7vw, 6rem)',
          maxWidth: '1500px',
          width: '100%',
        }}
      >
        {/* Subtitle / Season Tag */}
        <div style={{ overflow: 'hidden', marginBottom: '0.85rem' }}>
          <span
            ref={(el) => {
              textLineRefs.current[0] = el;
            }}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            SERIES 01 // AUTUMN WINTER 2026
          </span>
        </div>

        {/* Massive Masked Lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15em', marginBottom: '2.5rem' }}>
          {/* Line 1 */}
          <div style={{ overflow: 'hidden' }}>
            <h1
              ref={(el) => {
                textLineRefs.current[1] = el;
              }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.75rem, 7.8vw, 9.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 0.92,
                textTransform: 'uppercase',
                color: '#ffffff',
                margin: 0,
              }}
            >
              TECHNICAL
            </h1>
          </div>

          {/* Line 2 with italic serif accent word (Radiant item #25) */}
          <div style={{ overflow: 'hidden' }}>
            <h1
              ref={(el) => {
                textLineRefs.current[2] = el;
              }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.75rem, 7.8vw, 9.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.035em',
                lineHeight: 0.92,
                textTransform: 'uppercase',
                color: '#ffffff',
                margin: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  marginRight: '0.22em',
                  display: 'inline-block',
                }}
              >
                effortless
              </span>
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                PRECISION
              </span>
            </h1>
          </div>
        </div>

        {/* Stark Black & White CTA Buttons (Radiant items #20, #65) */}
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <div
            ref={(el) => {
              textLineRefs.current[3] = el;
            }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Button 1: Stark White Button */}
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
                transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
            >
              <span>EXPLORE SERIES</span>
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>

            {/* Button 2: Stark Black / Transparent Button */}
            <button
              onClick={() => onNavigate('/lookbook')}
              className="btn-stark-dark"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '1rem 2.25rem',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              <span>VIEW LOOKBOOK</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hotspotPulseRing {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};
