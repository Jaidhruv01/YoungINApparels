import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CMSSection } from '../../types';
import { MaskedRevealHeader } from '../common/MaskedRevealHeader';

interface EditorialSplitProps {
  cmsData?: CMSSection | null;
  onNavigate: (path: string) => void;
}

export const EditorialSplit: React.FC<EditorialSplitProps> = ({ cmsData, onNavigate }) => {
  const title = cmsData?.title || 'UNCOMPROMISING PERFORMANCE';
  const subtitle = cmsData?.subtitle || 'Built for the aesthetic. Engineered for the lift. YoungIN delivers brutalist, high-contrast gymwear that never restricts your range of motion.';
  const ctaText = cmsData?.cta_text || 'VIEW ALL GEAR';
  const ctaLink = cmsData?.cta_link || '/collections';
  const image = cmsData?.image_url || '/images/editorial-split.jpg';

  return (
    <section
      style={{
        backgroundColor: '#000000',
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
                backgroundColor: '#121212',
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
                border: '1px solid rgba(138, 3, 3, 0.45)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          </div>

          {/* Text Editorial Column */}
          <div style={{ maxWidth: '540px' }}>
            <MaskedRevealHeader
              tag="THE PERFORMANCE PHILOSOPHY // BRUTALIST ROOTS"
              lines={['UNCOMPROMISING', 'PERFORMANCE']}
              italicSuffix="Industrial Force"
              style={{
                fontSize: 'clamp(1.65rem, 5.5vw, 3.5rem)',
                lineHeight: 1.12,
                marginBottom: '1.75rem',
                color: '#ffffff',
              }}
            />

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
                borderLeft: '2px solid var(--color-campaign-red)',
                paddingLeft: '1.25rem',
                marginBottom: '2.5rem',
                fontStyle: 'italic',
                color: '#e5e5e5',
                fontSize: '0.9375rem',
              }}
            >
              "We reject average. YoungIN is built upon resilient fabrics designed to outlast your toughest training blocks."
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
