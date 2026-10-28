import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { CMSSection } from '../../types';

interface CampaignHeroProps {
  cmsData?: CMSSection | null;
  onNavigate: (path: string) => void;
}

export const CampaignHero: React.FC<CampaignHeroProps> = ({ cmsData, onNavigate }) => {
  const title = cmsData?.title || 'ENGINEERED FOR THE GRIND';
  const subtitle = cmsData?.subtitle || 'High-performance activewear built for high-intensity training. Featuring our signature 4-way stretch poly-nylon compression wear and heavy-duty 350GSM training joggers.';
  const ctaText = cmsData?.cta_text || 'SHOP THE DROP';
  const ctaLink = cmsData?.cta_link || '/collections/compression';
  const image = cmsData?.image_url || '/images/campaign-hero.jpg';

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        minHeight: 'clamp(580px, 85vh, 880px)',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* Background Campaign Visual */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      >
        <img
          src={image}
          alt="YoungIN Performance Campaign"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            filter: 'brightness(0.92) contrast(1.05)',
          }}
        />
        {/* Subtle cinematic gradient vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.92) 100%)',
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
          zIndex: 10,
          backgroundColor: 'rgba(10, 10, 10, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '0.6rem 1.2rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#b51224',
            display: 'inline-block',
          }}
        />
        <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          STRENGTH DROP // 01 — CRAFTED IN INDIA
        </span>
      </div>

      {/* Hero Headline & Actions */}
      <div
        className="container-custom"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingBottom: 'clamp(2.5rem, 5vw, 5rem)',
          paddingTop: 'clamp(3rem, 6vw, 4rem)',
          color: '#ffffff',
          maxWidth: '900px',
        }}
      >
        <span
          className="eyebrow"
          style={{
            color: '#b51224',
            display: 'inline-block',
            marginBottom: '0.75rem',
          }}
        >
          HIGH-PERFORMANCE GYMWEAR // INDIA
        </span>

        <h1
          style={{
            fontSize: 'clamp(1.85rem, 6vw, 5.25rem)',
            lineHeight: 1.02,
            letterSpacing: '-0.01em',
            marginBottom: '1.25rem',
            color: '#ffffff',
            overflowWrap: 'break-word',
            wordBreak: 'normal',
            hyphens: 'none',
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.875rem, 1.25vw, 1.15rem)',
            color: '#cccccc',
            maxWidth: '620px',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {subtitle}
        </p>

        <div className="hero-actions-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate(ctaLink)}
            className="btn-crimson"
            style={{
              padding: '1rem 2rem',
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
              padding: '1rem 1.75rem',
              fontSize: '0.8125rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#ffffff',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Eye size={16} />
            <span>EXPLORE JOGGERS</span>
          </button>
        </div>
      </div>

      <style>{`
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
