import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollDrivenNarrativeProps {
  onNavigate: (path: string) => void;
}

export const ScrollDrivenNarrative: React.FC<ScrollDrivenNarrativeProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const slide3Ref = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const slides = [
    {
      index: '01 / 03',
      tag: 'ARCHITECTURAL COMPRESSION',
      title: 'THE ARCHITECTURE OF MOVEMENT',
      italicWord: 'tailored',
      description:
        'High-tensile compression engineering sculpted with flatlock seams and 4-way stretch poly-nylon fibers.',
      image: '/images/campaign-hero.jpg',
      cta: 'EXPLORE COMPRESSION',
      link: '/collections/compression',
    },
    {
      index: '02 / 03',
      tag: 'HEAVYWEIGHT FORM',
      title: '350GSM COMBED FLEECE',
      italicWord: 'unyielding',
      description:
        'Architectural silhouettes crafted from heavyweight brushed fleece with reinforced barbell friction panels.',
      image: '/images/editorial-split.jpg',
      cta: 'EXPLORE JOGGERS',
      link: '/collections/joggers',
    },
    {
      index: '03 / 03',
      tag: 'ATELIER EDITION',
      title: 'UNCOMPROMISING PRECISION',
      italicWord: 'effortless',
      description:
        'Hand-finished athletic garments produced in restricted seasonal runs for enduring form and zero compromise.',
      image: '/images/lookbook-campaign.jpg',
      cta: 'VIEW THE EDIT',
      link: '/lookbook',
    },
  ];

  useEffect(() => {
    // Respect prefers-reduced-motion (Radiant item #81)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current || !pinTargetRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinTargetRef.current,
          scrub: 1,
          snap: {
            snapTo: [0, 0.5, 1],
            duration: 0.45,
            ease: 'power2.inOut',
          },
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.33) {
              setActiveSlideIndex(0);
            } else if (p < 0.75) {
              setActiveSlideIndex(1);
            } else {
              setActiveSlideIndex(2);
            }
          },
        },
      });

      // Initial states
      gsap.set(slide1Ref.current, { opacity: 1, scale: 1 });
      gsap.set(slide2Ref.current, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 });
      gsap.set(slide3Ref.current, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 });

      gsap.set(text1Ref.current, { opacity: 1, y: 0 });
      gsap.set(text2Ref.current, { opacity: 0, y: 60 });
      gsap.set(text3Ref.current, { opacity: 0, y: 60 });

      // PHASE 1: Transition Slide 1 -> Slide 2 (Radiant items #74, #75, #76)
      tl.to(slide1Ref.current, { scale: 1.1, opacity: 0.2, duration: 1, ease: 'none' }, 0)
        .to(slide2Ref.current, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1.0, duration: 1, ease: 'none' }, 0)
        .to(text1Ref.current, { y: -60, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
        .to(text2Ref.current, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.45)
        .to(progressLineRef.current, { scaleX: 0.66, duration: 1, ease: 'none' }, 0);

      // PHASE 2: Transition Slide 2 -> Slide 3
      tl.to(slide2Ref.current, { scale: 1.1, opacity: 0.2, duration: 1, ease: 'none' }, 1)
        .to(slide3Ref.current, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1.0, duration: 1, ease: 'none' }, 1)
        .to(text2Ref.current, { y: -60, opacity: 0, duration: 0.45, ease: 'power2.in' }, 1)
        .to(text3Ref.current, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 1.45)
        .to(progressLineRef.current, { scaleX: 1.0, duration: 1, ease: 'none' }, 1);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero-narrative"
      ref={containerRef}
      data-header-theme="dark"
      style={{
        position: 'relative',
        width: '100%',
        height: '300vh',
        backgroundColor: '#000000',
      }}
    >
      {/* Pinned Viewport Container */}
      <div
        ref={pinTargetRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#000000',
        }}
      >
        {/* Layer 1: Stacked Background Images (Radiant item #73) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {/* Slide 1 Image */}
          <div
            ref={slide1Ref}
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              willChange: 'transform, opacity',
            }}
          >
            <img
              src={slides[0].image}
              alt="Slide 1"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.72) contrast(1.15)',
              }}
            />
          </div>

          {/* Slide 2 Image with Clip Path Wipe */}
          <div
            ref={slide2Ref}
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              willChange: 'clip-path, transform',
            }}
          >
            <img
              src={slides[1].image}
              alt="Slide 2"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.68) contrast(1.15)',
              }}
            />
          </div>

          {/* Slide 3 Image with Clip Path Wipe */}
          <div
            ref={slide3Ref}
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              willChange: 'clip-path, transform',
            }}
          >
            <img
              src={slides[2].image}
              alt="Slide 3"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.68) contrast(1.15)',
              }}
            />
          </div>

          {/* Contrast overlays */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        </div>

        {/* Layer 2: Synced Text On Top (Radiant item #76) */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            padding: '0 clamp(1.5rem, 6vw, 6rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <div style={{ position: 'relative', minHeight: '360px', display: 'flex', alignItems: 'center' }}>
            {/* Text Slide 1 */}
            <div
              ref={text1Ref}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                maxWidth: '850px',
                pointerEvents: activeSlideIndex === 0 ? 'auto' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '1rem',
                  display: 'inline-block',
                }}
              >
                {slides[0].tag}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  lineHeight: 0.95,
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                THE ARCHITECTURE OF{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                    textTransform: 'none',
                  }}
                >
                  {slides[0].italicWord}
                </span>{' '}
                MOVEMENT
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#cccccc',
                  lineHeight: 1.6,
                  maxWidth: '560px',
                  marginBottom: '2rem',
                }}
              >
                {slides[0].description}
              </p>
              <button
                onClick={() => onNavigate(slides[0].link)}
                className="btn-stark-white"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '1px solid #ffffff',
                  padding: '0.9rem 2rem',
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
                <span>{slides[0].cta}</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </div>

            {/* Text Slide 2 */}
            <div
              ref={text2Ref}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                maxWidth: '850px',
                pointerEvents: activeSlideIndex === 1 ? 'auto' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '1rem',
                  display: 'inline-block',
                }}
              >
                {slides[1].tag}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  lineHeight: 0.95,
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                350GSM{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                    textTransform: 'none',
                  }}
                >
                  {slides[1].italicWord}
                </span>{' '}
                FLEECE
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#cccccc',
                  lineHeight: 1.6,
                  maxWidth: '560px',
                  marginBottom: '2rem',
                }}
              >
                {slides[1].description}
              </p>
              <button
                onClick={() => onNavigate(slides[1].link)}
                className="btn-stark-white"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '1px solid #ffffff',
                  padding: '0.9rem 2rem',
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
                <span>{slides[1].cta}</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </div>

            {/* Text Slide 3 */}
            <div
              ref={text3Ref}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                maxWidth: '850px',
                pointerEvents: activeSlideIndex === 2 ? 'auto' : 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.75)',
                  marginBottom: '1rem',
                  display: 'inline-block',
                }}
              >
                {slides[2].tag}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  lineHeight: 0.95,
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                UNCOMPROMISING{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    letterSpacing: '0.01em',
                    textTransform: 'none',
                  }}
                >
                  {slides[2].italicWord}
                </span>{' '}
                PRECISION
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#cccccc',
                  lineHeight: 1.6,
                  maxWidth: '560px',
                  marginBottom: '2rem',
                }}
              >
                {slides[2].description}
              </p>
              <button
                onClick={() => onNavigate(slides[2].link)}
                className="btn-stark-white"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '1px solid #ffffff',
                  padding: '0.9rem 2rem',
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
                <span>{slides[2].cta}</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator: Numbers & Thin Line (Radiant item #79) */}
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: 'clamp(1.5rem, 5vw, 5rem)',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#ffffff',
            }}
          >
            {slides[activeSlideIndex].index}
          </span>

          <div
            style={{
              width: '80px',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressLineRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '100%',
                backgroundColor: '#ffffff',
                transformOrigin: 'left center',
                transform: 'scaleX(0.33)',
                willChange: 'transform',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
