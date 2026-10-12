import React from 'react';
import { ArrowRight, Shield, Award, Compass } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', paddingBottom: '6rem' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          paddingTop: '6rem',
          paddingBottom: '6rem',
          textAlign: 'center',
        }}
      >
        <div className="container-narrow">
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '1rem' }}>
            YOUNGIN APPARELS // ATELIER MANIFESTO
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', lineHeight: 1.05, marginBottom: '1.5rem', color: '#ffffff' }}>
            ARCHITECTURAL DRAPERY & RIGOROUS CRAFT
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto' }}>
            Founded in the intersection of contemporary runway high-fashion and industrial brutalism. Designed with timeless restraint.
          </p>
        </div>
      </div>

      {/* Narrative Section 1 */}
      <div className="container-custom" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
              CHAPTER I — ORIGINS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '1.5rem' }}>
              THE RADIAN DESIGN PHILOSOPHY
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#555555', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              YoungINApparels was founded on the conviction that everyday clothing should possess the structural intentionality of modernist architecture. We eliminate superfluous ornament in favor of weight, proportion, and texture.
            </p>
            <p style={{ fontSize: '0.9375rem', color: '#555555', lineHeight: 1.8 }}>
              Every collection is born as an archival study. Rather than following fast-fashion trend cycles, our garments are engineered in strictly limited production runs using vintage European virgin wools, 500GSM Portuguese cotton fleece, and Japanese shuttle-loom denim.
            </p>
          </div>

          <div style={{ aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#f7f6f4' }}>
            <img
              src="/images/campaign-hero.jpg"
              alt="YoungIN Atelier Studio"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ backgroundColor: '#faf9f8', borderTop: '1px solid #e7e5e3', borderBottom: '1px solid #e7e5e3', padding: '5rem 0' }}>
        <div className="container-custom">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem auto' }}>
            <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.5rem' }}>
              CORE PILLARS
            </span>
            <h2 style={{ fontSize: '2.25rem', textTransform: 'uppercase' }}>
              OUR FOUR FOUNDATIONS
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
              <Compass size={28} color="#b51224" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                EXACTING PROPORTION
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#666666', lineHeight: 1.7 }}>
                Drop shoulders, cropped body blocks, and balanced silhouettes calculated to provide an effortless, dramatic drape.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
              <Shield size={28} color="#b51224" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                SUBSTANTIAL FABRICATION
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#666666', lineHeight: 1.7 }}>
                We work only with heavyweight materials: 850GSM Italian wool, 500GSM terry cotton, and 14oz Okayama raw selvedge denim.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
              <Award size={28} color="#b51224" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                ARTISANAL FINISHING
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#666666', lineHeight: 1.7 }}>
                Gunmetal Riri hardware, genuine horn buttons, blind hems, and hand-rolled mulberry silk finishes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
          EXPLORE THE ARCHIVE
        </h2>
        <p style={{ color: '#6b6b6b', maxWidth: '520px', margin: '0 auto 2.5rem auto', fontSize: '0.9375rem' }}>
          Discover the seasonal garments currently available in our limited production run.
        </p>
        <button onClick={() => onNavigate('/collections')} className="btn-primary" style={{ padding: '1.1rem 2.5rem' }}>
          <span>VIEW COLLECTION CATALOG</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
