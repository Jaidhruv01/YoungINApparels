import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CMSSection } from '../../types';

interface EditorialSplitProps {
  cmsData?: CMSSection | null;
  onNavigate: (path: string) => void;
}

export const EditorialSplit: React.FC<EditorialSplitProps> = ({ cmsData, onNavigate }) => {
  const title = cmsData?.title || 'UNCOMPROMISING TAILORING';
  const subtitle = cmsData?.subtitle || 'Structured drapery engineered for contemporary proportions. Every piece is cut from ethically sourced European virgin wool and custom Japanese shuttle looms.';
  const ctaText = cmsData?.cta_text || 'DISCOVER THE CRAFT';
  const ctaLink = cmsData?.cta_link || '/about';
  const image = cmsData?.image_url || '/images/editorial-split.jpg';

  return (
    <section
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        overflow: 'hidden',
      }}
    >
      <div className="container-custom">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          {/* Image Column */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                aspectRatio: '3/4',
                overflow: 'hidden',
                backgroundColor: '#161616',
                position: 'relative',
              }}
            >
              <img
                src={image}
                alt="YoungINApparels Atelier Editorial"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Accent Border Frame */}
            <div
              className="editorial-accent-frame"
              style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                right: '15px',
                bottom: '15px',
                border: '1px solid rgba(181, 18, 36, 0.4)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          </div>

          {/* Text Editorial Column */}
          <div style={{ maxWidth: '540px' }}>
            <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '1rem' }}>
              THE ATELIER PHILOSOPHY
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 4.2vw, 3.5rem)',
                lineHeight: 1.05,
                marginBottom: '1.75rem',
                color: '#ffffff',
              }}
            >
              {title}
            </h2>

            <p
              style={{
                fontSize: '1rem',
                color: '#a3a3a3',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              {subtitle}
            </p>

            <blockquote
              style={{
                borderLeft: '2px solid #b51224',
                paddingLeft: '1.25rem',
                marginBottom: '2.5rem',
                fontStyle: 'italic',
                color: '#e5e5e5',
                fontSize: '0.9375rem',
              }}
            >
              "We reject the seasonal churn of fast-fashion. YoungINApparels is built upon permanent silhouettes designed to outlast trends."
            </blockquote>

            <button
              onClick={() => onNavigate(ctaLink)}
              className="btn-crimson"
              style={{
                padding: '1.1rem 2.25rem',
                fontSize: '0.8125rem',
              }}
            >
              <span>{ctaText}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
