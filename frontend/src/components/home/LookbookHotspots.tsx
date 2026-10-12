import React, { useState } from 'react';
import { LookbookData, LookbookHotspot } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';

interface LookbookHotspotsProps {
  lookbookData: LookbookData | null;
  onNavigate: (path: string) => void;
}

export const LookbookHotspots: React.FC<LookbookHotspotsProps> = ({ lookbookData, onNavigate }) => {
  const [activeHotspot, setActiveHotspot] = useState<LookbookHotspot | null>(null);
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<number | null>(null);

  if (!lookbookData) return null;

  const handleQuickAdd = async (e: React.MouseEvent, hotspot: LookbookHotspot) => {
    e.stopPropagation();
    try {
      setAddingId(hotspot.id);
      // Hotspot links to product, we will navigate or if we have variant we add to cart
      // Let's navigate to product or add first available variant
      if (hotspot.product_slug) {
        onNavigate(`/products/${hotspot.product_slug}`);
      }
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        borderTop: '1px solid #1c1c1c',
        borderBottom: '1px solid #1c1c1c',
      }}
    >
      <div className="container-custom">
        {/* Header */}
        <div style={{ maxWidth: '680px', marginBottom: '3.5rem' }}>
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
            INTERACTIVE LOOKBOOK
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff',
              marginBottom: '1rem',
            }}
          >
            {lookbookData.title}
          </h2>
          <p style={{ color: '#a0a0a0', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {lookbookData.subtitle}
          </p>
        </div>

        {/* Lookbook Canvas with Hotspots */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
            borderRadius: '2px',
            overflow: 'hidden',
            backgroundColor: '#141414',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          }}
          onClick={() => setActiveHotspot(null)}
        >
          {/* Main Campaign Visual */}
          <img
            src={lookbookData.image_url}
            alt="YoungINApparels Interactive Lookbook"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              aspectRatio: '16/9',
              objectFit: 'cover',
            }}
          />

          {/* Interactive Hotspot Pins */}
          {lookbookData.hotspots.map((hotspot) => {
            const isSelected = activeHotspot?.id === hotspot.id;

            return (
              <div
                key={hotspot.id}
                className="hotspot-pin"
                style={{
                  left: `${hotspot.x_percent}%`,
                  top: `${hotspot.y_percent}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(isSelected ? null : hotspot);
                }}
                title={hotspot.title}
              >
                <div className="hotspot-ring" />
                <div
                  className="hotspot-center"
                  style={{
                    backgroundColor: isSelected ? '#b51224' : '#ffffff',
                    transform: isSelected ? 'translate(-50%, -50%) scale(1.4)' : undefined,
                  }}
                />
              </div>
            );
          })}

          {/* Active Hotspot Popover Card */}
          {activeHotspot && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(75, Math.max(25, activeHotspot.x_percent))}%`,
                top: `${Math.min(75, Math.max(25, activeHotspot.y_percent))}%`,
                transform: 'translate(-50%, -120%)',
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #333333',
                padding: '1.25rem',
                width: '300px',
                zIndex: 50,
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                animation: 'fadeIn 0.2s ease-out',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: '#b51224',
                    textTransform: 'uppercase',
                  }}
                >
                  {activeHotspot.tag}
                </span>
                <button
                  onClick={() => setActiveHotspot(null)}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                {activeHotspot.product_image && (
                  <img
                    src={activeHotspot.product_image}
                    alt={activeHotspot.title}
                    style={{ width: '60px', height: '80px', objectFit: 'cover', backgroundColor: '#222' }}
                  />
                )}
                <div>
                  <h4
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      lineHeight: 1.3,
                      marginBottom: '4px',
                    }}
                  >
                    {activeHotspot.title}
                  </h4>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>
                    {formatPrice(activeHotspot.price)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={(e) => handleQuickAdd(e, activeHotspot)}
                  className="btn-crimson"
                  style={{
                    flex: 1,
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.6875rem',
                  }}
                >
                  <span>INSPECT PIECE</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hotspots Instruction Hint */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#666666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ● CLICK OR TAP ANY HOTSPOT PIN ON THE MODEL TO VIEW GARMENT DETAILS
          </span>
        </div>
      </div>
    </section>
  );
};
