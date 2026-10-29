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
            YOUNGIN // ATHLETE MANIFESTO
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5.5vw, 4.25rem)', lineHeight: 1.12, wordBreak: 'break-word', marginBottom: '1.5rem', color: '#ffffff' }}>
            PEAK STRENGTH & ANATOMICAL PRECISION
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '680px', margin: '0 auto' }}>
            Engineered in India for athletes, bodybuilders, and uncompromising physical discipline. Designed with purpose.
          </p>
        </div>
      </div>

      {/* Narrative Section 1 */}
      <div className="container-custom" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
              CHAPTER I — ORIGINS
            </span>
            <h2 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2.75rem)', lineHeight: 1.15, wordBreak: 'break-word', marginBottom: '1.5rem' }}>
              STRENGTH MEETS MODERN CRAFT
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#555555', lineHeight: 1.8, marginBottom: '1.25rem' }}>
              YoungIN was founded on the conviction that training apparel should combine high-tensile performance engineering with modern aesthetic dominance. We eliminate fragile synthetic fabrics in favor of true fabric weight, muscle-hugging compression, and enduring resilience.
            </p>
            <p style={{ fontSize: '0.9375rem', color: '#555555', lineHeight: 1.8 }}>
              From our 350GSM ultra-heavyweight fleece lowers and breathable 270GSM daily trainers to our multi-tier compression systems and sculpted ribbed vests, every piece is designed, stress-tested, and assembled in India for the relentless pursuer of physical strength.
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
            <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', textTransform: 'uppercase' }}>
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
                ANATOMICAL PRECISION
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#666666', lineHeight: 1.7 }}>
                Ergonomic seam mapping, flatlock anti-chafing stitching, and physique-accentuating cuts engineered for complete range of motion on heavy lifts.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
              <Shield size={28} color="#b51224" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                TECHNICAL FABRICATION
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#666666', lineHeight: 1.7 }}>
                Engineered with high-tensile 4-way stretch poly-nylon, strategic nylon mesh panels, and heavy-duty 250GSM & 350GSM organic combed fabrics.
              </p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
              <Award size={28} color="#b51224" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                UNCOMPROMISING RESILIENCE
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#666666', lineHeight: 1.7 }}>
                Reinforced barbell guard zones, heavy-duty waistbands, and resilient fibers designed to withstand hundreds of high-volume workouts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-custom" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <h2 style={{ fontSize: 'clamp(1.65rem, 5vw, 2.5rem)', lineHeight: 1.15, marginBottom: '1.25rem', textTransform: 'uppercase' }}>
          ENGINEERED FOR THE GRIND
        </h2>
        <p style={{ color: '#6b6b6b', maxWidth: '520px', margin: '0 auto 2.5rem auto', fontSize: '0.9375rem' }}>
          Discover the high-performance activewear and technical compression gear currently live in our launch capsule.
        </p>
        <button onClick={() => onNavigate('/collections')} className="btn-crimson" style={{ padding: '1.1rem 2.5rem' }}>
          <span>VIEW ALL GEAR</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
