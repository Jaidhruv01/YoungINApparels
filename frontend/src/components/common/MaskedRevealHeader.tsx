import React, { useEffect, useRef, useState } from 'react';

interface MaskedRevealHeaderProps {
  lines: string[];
  tag?: string;
  italicSuffix?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
  style?: React.CSSProperties;
  staggerDelay?: number;
  threshold?: number;
}

export const MaskedRevealHeader: React.FC<MaskedRevealHeaderProps> = ({
  lines,
  tag,
  italicSuffix,
  as: Tag = 'h2',
  className = '',
  style = {},
  staggerDelay = 0.08,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Trigger reveal when heading hits 85% of viewport height
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -15% 0px',
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`masked-reveal-header-container ${className}`}>
      {tag && (
        <div className="masked-line-wrap" style={{ marginBottom: '0.75rem' }}>
          <span
            className={`font-mono-tag ${isRevealed ? 'is-revealed' : ''}`}
            style={{
              display: 'inline-block',
              transform: isRevealed ? 'translateY(0%)' : 'translateY(110%)',
              opacity: isRevealed ? 1 : 0,
              transition: 'transform 0.7s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.7s ease',
              color: 'var(--color-campaign-red)',
            }}
          >
            {tag}
          </span>
        </div>
      )}

      <Tag
        className={`masked-header-element ${isRevealed ? 'revealed-tracking' : 'initial-tracking'}`}
        style={{
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: isRevealed ? '0.01em' : '-0.04em',
          transition: 'letter-spacing 800ms cubic-bezier(0.16, 1, 0.3, 1)',
          ...style,
        }}
      >
        {lines.map((line, idx) => (
          <span key={idx} className="masked-line-wrap" style={{ display: 'block', overflow: 'hidden' }}>
            <span
              className={`masked-line ${isRevealed ? 'is-revealed' : ''}`}
              style={{
                display: 'block',
                transform: isRevealed ? 'translateY(0%) rotate(0deg)' : 'translateY(110%) rotate(2deg)',
                opacity: isRevealed ? 1 : 0,
                transitionProperty: 'transform, opacity',
                transitionDuration: '0.9s',
                transitionTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
                transitionDelay: `${idx * staggerDelay}s`,
                willChange: 'transform, opacity',
              }}
            >
              {line}
              {idx === lines.length - 1 && italicSuffix && (
                <span
                  className="font-serif-italic"
                  style={{
                    fontFamily: 'var(--font-serif-italic)',
                    textTransform: 'none',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    marginLeft: '0.5rem',
                    letterSpacing: '0.02em',
                    color: 'inherit',
                    opacity: 0.9,
                  }}
                >
                  {italicSuffix}
                </span>
              )}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
};
