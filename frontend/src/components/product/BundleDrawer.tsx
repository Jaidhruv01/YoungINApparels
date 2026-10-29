import React, { useState, useEffect, useRef } from 'react';
import { X, Check, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { smoothScrollEngine } from '../../utils/smoothScroll';

export interface BundleItem {
  id: number;
  variantId: number;
  title: string;
  category: string;
  specs: string;
  price: number;
  compare_at_price?: number;
  image_url: string;
  size: string;
  available_sizes: string[];
  included: boolean;
  slug: string;
}

interface BundleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  initialItems?: BundleItem[];
}

const DEFAULT_BUNDLE: BundleItem[] = [
  {
    id: 101,
    variantId: 1,
    title: 'PRO-ARMOR SEAMLESS COMPRESSION',
    category: 'COMPRESSION',
    specs: '4-Way Poly-Nylon • 320GSM',
    price: 1899,
    compare_at_price: 2499,
    image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=85',
    size: 'M',
    available_sizes: ['S', 'M', 'L', 'XL'],
    included: true,
    slug: 'pro-armor-seamless-compression',
  },
  {
    id: 102,
    variantId: 2,
    title: 'HEAVYWEIGHT 350GSM POWERLIFTING LOWER',
    category: 'LOWERS',
    specs: '100% Dense Milled Fleece • Ankle Cuffs',
    price: 2499,
    compare_at_price: 3299,
    image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=85',
    size: 'L',
    available_sizes: ['S', 'M', 'L', 'XL'],
    included: true,
    slug: 'heavyweight-350gsm-lower',
  },
  {
    id: 103,
    variantId: 3,
    title: 'TECHNICAL RIBBED ATHLETIC VEST',
    category: 'TANKS & VESTS',
    specs: 'Drop Armhole • Moisture Hydrophilic',
    price: 1199,
    compare_at_price: 1599,
    image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=85',
    size: 'M',
    available_sizes: ['S', 'M', 'L', 'XL'],
    included: true,
    slug: 'technical-ribbed-vest',
  },
];

export const BundleDrawer: React.FC<BundleDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialItems,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [items, setItems] = useState<BundleItem[]>(initialItems || DEFAULT_BUNDLE);
  const [isAdding, setIsAdding] = useState(false);
  const [prevSubtotal, setPrevSubtotal] = useState(0);
  const [animatingPrice, setAnimatingPrice] = useState(false);

  // Manage body scroll locking with Lenis compensation
  useEffect(() => {
    if (isOpen) {
      smoothScrollEngine.lockScroll();
    } else {
      smoothScrollEngine.unlockScroll();
    }
    return () => {
      smoothScrollEngine.unlockScroll();
    };
  }, [isOpen]);

  const includedItems = items.filter((item) => item.included);
  const rawSubtotal = includedItems.reduce((acc, curr) => acc + curr.price, 0);

  // 15% Bundle savings when 2 or more pieces are bundled
  const bundleDiscount = includedItems.length >= 2 ? Math.round(rawSubtotal * 0.15) : 0;
  const finalBundleTotal = Math.max(0, rawSubtotal - bundleDiscount);

  // Vertical sliding number roll when subtotal updates
  useEffect(() => {
    if (finalBundleTotal !== prevSubtotal) {
      setAnimatingPrice(true);
      const timer = setTimeout(() => {
        setPrevSubtotal(finalBundleTotal);
        setAnimatingPrice(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [finalBundleTotal, prevSubtotal]);

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, included: !item.included } : item
      )
    );
  };

  const setItemSize = (id: number, size: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, size } : item))
    );
  };

  const handleAddBundleToBag = async () => {
    if (includedItems.length === 0) return;
    try {
      setIsAdding(true);
      for (const item of includedItems) {
        await addToCart(item.variantId, 1);
      }
      onClose();
    } catch (err) {
      console.error('Failed to add bundle to bag:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      {/* Backdrop Dimming (opacity: 0 -> 1 over 300ms) */}
      <div
        className={`bundle-backdrop ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 300ms ease-out',
        }}
      />

      {/* Bottom Fixed Drawer Container with Spring Motion Physics */}
      <div
        className={`bundle-drawer-panel ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '92vh',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 -20px 50px rgba(0, 0, 0, 0.9)',
          zIndex: 1005,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateY(0%)' : 'translateY(100%)',
          // Spring motion physics: Mass: 1, Stiffness: 280, Damping: 28
          // Corresponds to cubic-bezier(0.175, 0.885, 0.32, 1.1) with 420ms duration
          transition: 'transform 420ms cubic-bezier(0.175, 0.885, 0.32, 1.1)',
          willChange: 'transform',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid #1a1a1a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0e0e0e',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                backgroundColor: 'var(--color-campaign-red)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '2px',
                textTransform: 'uppercase',
              }}
            >
              BETTER TOGETHER
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              ATHLETE FULL-RIG BUNDLE // 3-PIECE SYSTEM
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888888',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'color 0.2s ease',
            }}
            aria-label="Close bundle drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body: Horizontal Flex Track with Hidden Native Scrollbar and Snap Points */}
        <div
          className="bundle-scroll-track"
          style={{
            padding: '1.5rem 2rem',
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`bundle-item-card ${item.included ? 'included' : 'excluded'}`}
              style={{
                flex: '0 0 310px',
                scrollSnapAlign: 'start',
                backgroundColor: item.included ? '#141414' : '#0d0d0d',
                border: item.included ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #1c1c1c',
                borderRadius: '3px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                opacity: item.included ? 1 : 0.65,
                transition: 'all 0.25s ease',
                position: 'relative',
              }}
            >
              {/* Product Thumbnail & Checkbox Toggle */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '90px',
                    height: '115px',
                    backgroundColor: '#1c1c1c',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5625rem',
                        color: 'var(--color-campaign-red)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      {item.category}
                    </span>
                    <h4
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        lineHeight: 1.3,
                        marginBottom: '4px',
                      }}
                    >
                      {item.title}
                    </h4>
                    <span style={{ fontSize: '0.6875rem', color: '#888888' }}>{item.specs}</span>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>
                      {formatPrice(item.price)}
                    </span>
                    {item.compare_at_price && (
                      <span style={{ fontSize: '0.75rem', color: '#666666', textDecoration: 'line-through' }}>
                        {formatPrice(item.compare_at_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Size Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.625rem', color: '#888888', fontWeight: 700, letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                  SELECT SIZE:
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {item.available_sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setItemSize(item.id, s)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        backgroundColor: item.size === s ? '#ffffff' : '#1f1f1f',
                        color: item.size === s ? '#000000' : '#ffffff',
                        border: 'none',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Included Row Toggle Checkbox */}
              <button
                onClick={() => toggleItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '0.6rem',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: item.included ? '1px solid var(--color-campaign-red)' : '1px solid #333333',
                  backgroundColor: item.included ? 'rgba(181, 18, 36, 0.12)' : 'transparent',
                  color: item.included ? 'var(--color-campaign-red)' : '#888888',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '2px',
                    border: item.included ? '1px solid var(--color-campaign-red)' : '1px solid #555555',
                    backgroundColor: item.included ? 'var(--color-campaign-red)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.included && <Check size={10} color="#ffffff" strokeWidth={3} />}
                </div>
                <span>{item.included ? 'INCLUDED IN BUNDLE' : 'ADD TO BUNDLE'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Drawer Footer & Dynamic Subtotal Calculation */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderTop: '1px solid #1a1a1a',
            backgroundColor: '#0c0c0c',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          {/* Bundle Savings & Calculation Counter with Vertical Slide Roll */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  BUNDLE SUBTOTAL ({includedItems.length} PIECES)
                </span>
                {bundleDiscount > 0 && (
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 800,
                      backgroundColor: 'var(--color-campaign-red)',
                      color: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: '2px',
                      letterSpacing: '0.08em',
                    }}
                  >
                    15% OFF BUNDLE SAVINGS
                  </span>
                )}
              </div>

              {/* Number Counter Transition: Sliding Number Roll (translateY(-100%) -> translateY(0%)) */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', overflow: 'hidden', height: '32px' }}>
                <div
                  className={`price-counter-roll ${animatingPrice ? 'animating' : ''}`}
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {formatPrice(finalBundleTotal)}
                </div>

                {bundleDiscount > 0 && (
                  <span style={{ fontSize: '0.9375rem', color: '#777777', textDecoration: 'line-through' }}>
                    {formatPrice(rawSubtotal)}
                  </span>
                )}
                {bundleDiscount > 0 && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>
                    YOU SAVE {formatPrice(bundleDiscount)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleAddBundleToBag}
              disabled={includedItems.length === 0 || isAdding}
              className="btn-crimson"
              style={{
                padding: '0.9rem 2rem',
                fontSize: '0.8125rem',
                letterSpacing: '0.12em',
                opacity: includedItems.length === 0 ? 0.5 : 1,
              }}
            >
              <ShoppingBag size={16} />
              <span>
                {isAdding
                  ? 'ADDING GEAR BUNDLE...'
                  : includedItems.length === 0
                  ? 'SELECT ITEMS'
                  : `ADD BUNDLE TO BAG (${includedItems.length})`}
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .bundle-scroll-track::-webkit-scrollbar {
          display: none !important;
        }
        .price-counter-roll {
          animation: priceRollIn 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes priceRollIn {
          0% {
            transform: translateY(-100%);
            opacity: 0.3;
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
