import React, { useState } from 'react';
import { LookbookData, LookbookHotspot } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { ArrowRight, ShoppingBag, X, Layers } from 'lucide-react';
import { MaskedRevealHeader } from '../common/MaskedRevealHeader';
import { BundleDrawer } from '../product/BundleDrawer';

interface LookbookHotspotsProps {
  lookbookData: LookbookData | null;
  onNavigate: (path: string) => void;
}

export const LookbookHotspots: React.FC<LookbookHotspotsProps> = ({ lookbookData, onNavigate }) => {
  const [activeHotspot, setActiveHotspot] = useState<LookbookHotspot | null>(null);
  const [isBundleDrawerOpen, setIsBundleDrawerOpen] = useState(false);
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<number | null>(null);

  if (!lookbookData) return null;

  const handleQuickAdd = async (e: React.MouseEvent, hotspot: LookbookHotspot) => {
    e.stopPropagation();
    try {
      setAddingId(hotspot.id);
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
        backgroundColor: '#000000',
        color: '#ffffff',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        borderTop: '1px solid #141414',
        borderBottom: '1px solid #141414',
      }}
    >
      <div className="container-custom">
        {/* Header with Masked Text Reveal */}
        <div style={{ maxWidth: '720px', marginBottom: '3.5rem' }}>
          <MaskedRevealHeader
            tag="INTERACTIVE LOOKBOOK // FIT ARCHIVE"
            lines={['DYNAMIC ATHLETE', 'SPECIFICATION PINPOINT']}
            italicSuffix="Performance Rig"
            style={{
              fontSize: 'clamp(1.5rem, 4.5vw, 3.25rem)',
              color: '#ffffff',
              marginBottom: '1rem',
              lineHeight: 1.12,
            }}
          />
          <p style={{ color: '#a0a0a0', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {lookbookData.subtitle || 'Tactical activewear engineered for extreme mechanical tension. Select or hover any pin to inspect fabric composition and fit.'}
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
            backgroundColor: '#111111',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
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
                className={`hotspot-pin ${isSelected ? 'is-active' : ''}`}
                style={{
                  left: `${hotspot.x_percent}%`,
                  top: `${hotspot.y_percent}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(isSelected ? null : hotspot);
                  setIsBundleDrawerOpen(true);
                }}
                title={hotspot.title}
              >
                <div className="hotspot-ring" />
                <div
                  className="hotspot-center"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-campaign-red)' : '#ffffff',
                  }}
                />

                {/* Connecting Line Vector */}
                <svg className="hotspot-connecting-line" width="30" height="2" viewBox="0 0 30 2">
                  <line x1="0" y1="1" x2="30" y2="1" className="hotspot-connecting-path" />
                </svg>

                {/* Floating Glass Card Expansion Adjacent to Pin */}
                <div className="hotspot-glass-card">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: 'var(--color-campaign-red)',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {hotspot.tag || 'SPECIFICATION'}
                  </span>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 900, textTransform: 'uppercase', color: '#ffffff', marginBottom: '4px' }}>
                    {hotspot.title}
                  </h4>
                  <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    {formatPrice(hotspot.price)}
                  </p>
                  <button
                    onClick={(e) => handleQuickAdd(e, hotspot)}
                    className="btn-crimson"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.6875rem',
                    }}
                  >
                    <span>INSPECT PIECE</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Active Hotspot Popover Card */}
          {activeHotspot && (
            <div
              className="lookbook-hotspot-popover"
              style={{
                left: `${Math.min(75, Math.max(25, activeHotspot.x_percent))}%`,
                top: `${Math.min(75, Math.max(25, activeHotspot.y_percent))}%`,
                transform: 'translate(-50%, -120%)',
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

        {/* Hotspots Instruction Hint & Bundle Drawer Trigger */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setIsBundleDrawerOpen(true)}
            className="btn-crimson"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              boxShadow: '0 8px 24px rgba(181, 18, 36, 0.25)',
            }}
          >
            <Layers size={15} />
            <span>OPEN "BETTER TOGETHER" GEAR BUNDLE (SAVE 15%)</span>
          </button>
          <span style={{ fontSize: '0.75rem', color: '#666666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ● CLICK OR TAP ANY HOTSPOT PIN ON THE ATHLETE TO OPEN THE GEAR BUNDLE DRAWER
          </span>
        </div>
      </div>

      {/* Section 7: Better Together Bottom Drawer Component */}
      <BundleDrawer
        isOpen={isBundleDrawerOpen}
        onClose={() => setIsBundleDrawerOpen(false)}
        onNavigate={onNavigate}
      />
    </section>
  );
};
