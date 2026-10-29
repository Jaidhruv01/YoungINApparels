import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { LookbookData } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';

interface LookbookHotspotsProps {
  lookbookData?: LookbookData | null;
  onNavigate: (path: string) => void;
}

interface BundleItem {
  id: number;
  variantId: number;
  title: string;
  specs: string;
  price: number;
  image: string;
  size: string;
  included: boolean;
}

export const LookbookHotspots: React.FC<LookbookHotspotsProps> = ({ lookbookData, onNavigate }) => {
  const { formatPrice } = useCurrency();
  const { addToCart, openCart } = useCart();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAddingBundle, setIsAddingBundle] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  const [bundleItems, setBundleItems] = useState<BundleItem[]>([
    {
      id: 1,
      variantId: 1,
      title: 'PRO-ARMOR SEAMLESS COMPRESSION',
      specs: '4-Way Poly-Nylon Base • Flatlock Seams',
      price: 2499,
      image: '/images/product-bomber.jpg',
      size: 'M',
      included: true,
    },
    {
      id: 2,
      variantId: 2,
      title: '350GSM HEAVYWEIGHT LOWER',
      specs: 'Brushed Combed Fleece • Deadlift Barbell Panels',
      price: 3499,
      image: '/images/product-denim.jpg',
      size: 'L',
      included: true,
    },
    {
      id: 3,
      variantId: 3,
      title: 'ARCHITECTURAL RIBBED TANK',
      specs: 'Ultra-Dense Rib • High-Sweat Hydrophilic',
      price: 1499,
      image: '/images/product-sweater.jpg',
      size: 'M',
      included: true,
    },
  ]);

  const lookbookImage = lookbookData?.image_url || '/images/lookbook-campaign.jpg';

  // Calculate bundle total
  const selectedItems = bundleItems.filter((i) => i.included);
  const bundleTotal = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
  const bundleDiscount = selectedItems.length >= 2 ? Math.round(bundleTotal * 0.15) : 0;
  const finalPrice = bundleTotal - bundleDiscount;

  const toggleItem = (id: number) => {
    setBundleItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, included: !item.included } : item))
    );
  };

  const handleAddBundleToCart = async () => {
    try {
      setIsAddingBundle(true);
      for (const item of selectedItems) {
        await addToCart(item.id, 1);
      }
      setBundleAdded(true);
      setTimeout(() => {
        setBundleAdded(false);
        setIsPanelOpen(false);
        openCart();
      }, 900);
    } catch {
      onNavigate('/collections/compression');
    } finally {
      setIsAddingBundle(false);
    }
  };

  return (
    <section
      id="lookbook-section"
      data-header-theme="dark"
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#000000',
        color: '#ffffff',
        padding: 'clamp(5rem, 8vw, 8rem) 0',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.75)',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            INTERACTIVE LOOKBOOK // SERIES 01
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 0.98,
              textTransform: 'uppercase',
              margin: '0 0 1.25rem 0',
            }}
          >
            THE COMPLETE{' '}
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: '0.01em',
                textTransform: 'none',
              }}
            >
              ensemble
            </span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#a3a3a3', lineHeight: 1.6, maxWidth: '580px' }}>
            Touch any pin on the model to reveal our signature coordinated bundle and unlock exclusive atelier ensemble pairing.
          </p>
        </div>

        {/* Model Canvas with Hotspots & Framer Motion Shrink (Radiant items #114, #115) */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            animate={{
              scale: isPanelOpen ? 0.9 : 1.0,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1200px',
              aspectRatio: '16 / 9',
              backgroundColor: '#0a0a0a',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
              cursor: isPanelOpen ? 'pointer' : 'default',
            }}
            onClick={() => isPanelOpen && setIsPanelOpen(false)}
          >
            <img
              src={lookbookImage}
              alt="Radiant Atelier Model Ensemble"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isPanelOpen ? 'brightness(0.5)' : 'brightness(0.85) contrast(1.1)',
                transition: 'filter 0.4s ease',
              }}
            />

            {/* Pulsing Hotspots on Model */}
            {!isPanelOpen && (
              <>
                {/* Hotspot 1: Compression Top */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPanelOpen(true);
                  }}
                  style={{
                    position: 'absolute',
                    top: '38%',
                    left: '52%',
                    cursor: 'pointer',
                    zIndex: 15,
                  }}
                  title="Inspect Ensemble"
                >
                  <div className="hotspot-pulse-circle">
                    <span className="pulse-ring" />
                    <span className="center-dot" />
                  </div>
                </div>

                {/* Hotspot 2: Lower */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPanelOpen(true);
                  }}
                  style={{
                    position: 'absolute',
                    top: '70%',
                    left: '46%',
                    cursor: 'pointer',
                    zIndex: 15,
                  }}
                  title="Inspect Ensemble"
                >
                  <div className="hotspot-pulse-circle">
                    <span className="pulse-ring" />
                    <span className="center-dot" />
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* White Bottom Panel: "BETTER TOGETHER" (Radiant items #115, #116, #117, #118, #119) */}
          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  zIndex: 30,
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  boxShadow: '0 -20px 50px rgba(0,0,0,0.4)',
                  maxHeight: '92%',
                  overflowY: 'auto',
                }}
              >
                {/* Panel Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.75rem',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                    paddingBottom: '1rem',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.03em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      BETTER TOGETHER
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#666666', letterSpacing: '0.04em' }}>
                      COORDINATED ATELIER ENSEMBLE // BUNDLE SAVINGS APPLIED
                    </span>
                  </div>

                  <button
                    onClick={() => setIsPanelOpen(false)}
                    aria-label="Close bundle drawer"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#000000',
                      cursor: 'pointer',
                      padding: '8px',
                    }}
                  >
                    <X size={24} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Individual Product Cards in Bundle */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  {bundleItems.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        padding: '1rem',
                        border: '1px solid rgba(0,0,0,0.08)',
                        backgroundColor: item.included ? '#fcfcfc' : '#f5f5f5',
                        opacity: item.included ? 1 : 0.5,
                        transition: 'opacity 0.2s ease',
                      }}
                    >
                      {/* Checkbox to include/exclude */}
                      <input
                        type="checkbox"
                        checked={item.included}
                        onChange={() => toggleItem(item.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#000000',
                          cursor: 'pointer',
                        }}
                      />

                      {/* Item Image */}
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: '70px',
                          height: '85px',
                          objectFit: 'cover',
                          backgroundColor: '#e5e5e5',
                        }}
                      />

                      {/* Item Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8125rem',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            margin: '0 0 3px 0',
                          }}
                        >
                          {item.title}
                        </h4>
                        <div style={{ fontSize: '0.6875rem', color: '#666666', marginBottom: '4px' }}>
                          Size: {item.size} • {item.specs}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700 }}>
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bundle Footer & Add Bundle to Cart Button (Radiant item #117) */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      BUNDLE TOTAL:
                    </span>
                    {bundleDiscount > 0 && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1rem',
                          color: '#888888',
                          textDecoration: 'line-through',
                        }}
                      >
                        {formatPrice(bundleTotal)}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: '#000000',
                      }}
                    >
                      {formatPrice(finalPrice)}
                    </span>
                    {bundleDiscount > 0 && (
                      <span
                        style={{
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          fontSize: '0.625rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        SAVE 15%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleAddBundleToCart}
                    disabled={isAddingBundle || selectedItems.length === 0}
                    className="btn-stark-white"
                    style={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '1.1rem 3rem',
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.25s ease, color 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.color = '#ffffff';
                    }}
                  >
                    {bundleAdded ? (
                      <>
                        <Check size={16} strokeWidth={2} />
                        <span>ADDED TO BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} strokeWidth={1.5} />
                        <span>ADD BUNDLE TO BAG</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .hotspot-pulse-circle {
          position: relative;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
          animation: hotspotPulseRing 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          pointer-events: none;
        }
        .center-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background-color: #ffffff;
          box-shadow: 0 0 10px rgba(255,255,255,0.9);
          display: block;
        }
        @keyframes hotspotPulseRing {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};
