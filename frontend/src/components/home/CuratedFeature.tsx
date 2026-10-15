import React from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight } from 'lucide-react';

interface CuratedFeatureProps {
  products: Product[];
  onNavigate: (path: string) => void;
}

export const CuratedFeature: React.FC<CuratedFeatureProps> = ({ products, onNavigate }) => {
  // Let's pair overcoat, hoodie, and boots
  const featuredCoats = products.filter((p) => p.category === 'Outerwear');
  const complementaryPieces = products.filter((p) => p.category === 'Tops' || p.category === 'Footwear').slice(0, 2);

  return (
    <section
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: '#f7f6f4',
        borderTop: '1px solid #e7e5e3',
      }}
    >
      <div className="container-custom">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem auto' }}>
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
            CURATED CAPSULE 01
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
              color: '#0a0a0a',
              marginBottom: '1rem',
            }}
          >
            THE ARCHIVE UNIFORM
          </h2>
          <p style={{ color: '#6b6b6b', fontSize: '0.9375rem' }}>
            A complete monochrome study: Combining 850GSM virgin wool tailoring with custom 500GSM fleece and Italian commando-sole footwear.
          </p>
        </div>

        {/* Asymmetrical Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Large Hero Feature Card */}
          {featuredCoats[0] && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e7e5e3',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                <img
                  src={featuredCoats[0].cover_image}
                  alt={featuredCoats[0].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  className="badge-sale"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                  }}
                >
                  FOUNDATIONAL PIECE
                </span>
              </div>
              <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.12em', color: '#b51224' }}>
                  CORE ANCHOR
                </span>
                <h3 style={{ fontSize: '1.25rem', marginTop: '6px', marginBottom: '8px' }}>
                  {featuredCoats[0].title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b6b6b', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {featuredCoats[0].short_summary}
                </p>
                <button
                  onClick={() => onNavigate(`/products/${featuredCoats[0].slug}`)}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  <span>INSPECT ANCHOR PIECE</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Right Column: Two Complementary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.5rem' }}>
            {complementaryPieces.map((p) => (
              <div key={p.id} style={{ backgroundColor: '#ffffff', padding: '1rem', border: '1px solid #e7e5e3' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#888', display: 'block', marginBottom: '8px', letterSpacing: '0.08em' }}>
                  LAYER 0{complementaryPieces.indexOf(p) + 2}
                </span>
                <ProductCard product={p} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
