import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CMSSection } from '../../types';

interface EditorialSplitProps {
  cmsData?: CMSSection | null;
  onNavigate: (path: string) => void;
}

export const EditorialSplit: React.FC<EditorialSplitProps> = ({ cmsData, onNavigate }) => {
  const title = cmsData?.title || 'UNCOMPROMISING FABRIC WEIGHT';
  const subtitle = cmsData?.subtitle || 'Every lower is crafted from custom-knit 350GSM and 270GSM dense cotton terry that holds its shape through hundreds of heavy squat sessions and washes.';
  const ctaText = cmsData?.cta_text || 'EXPLORE LOWERS';
  const ctaLink = cmsData?.cta_link || '/collections/350gsm-lowers';
  const image = cmsData?.image_url || '/images/editorial-split.jpg';

  return (
    <section
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
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
                alt="YoungIN Performance Editorial"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Accent Border Frame (hidden on small mobile to avoid text or layout overflow) */}
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
              THE PERFORMANCE PHILOSOPHY
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.25rem, 4.2vw, 3.5rem)',
                lineHeight: 1.05,
                marginBottom: '1.75rem',
                color: '#ffffff',
                overflowWrap: 'break-word',
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
              "Discipline in training requires discipline in craft. YoungIN gymwear is engineered in India to withstand high-volume workouts with zero loss of shape."
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

      <style>{`
        @media (max-width: 640px) {
          .editorial-accent-frame {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};
