import React, { useState, useEffect } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';
import { smoothScrollEngine } from '../../utils/smoothScroll';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (isCartOpen) {
      smoothScrollEngine.lockScroll();
    } else {
      smoothScrollEngine.unlockScroll();
    }
    return () => {
      smoothScrollEngine.unlockScroll();
    };
  }, [isCartOpen]);

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [animatedPercent, setAnimatedPercent] = useState<number>(0);

  const subtotal = cart?.subtotal || 0;
  const freeThreshold = cart?.free_shipping_threshold || 1999;
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);
  const amountNeeded = Math.max(0, freeThreshold - subtotal);
  const isUnlocked = progressPercent >= 100;

  // Fill Animation: 0% -> calculatedPercentage% over 800ms using cubic-bezier(0.65, 0, 0.35, 1)
  useEffect(() => {
    if (isCartOpen) {
      setAnimatedPercent(0);
      const timer = setTimeout(() => {
        setAnimatedPercent(progressPercent);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setAnimatedPercent(0);
    }
  }, [isCartOpen, progressPercent]);

  // Cart Item Removal Collapse: fade opacity 1 -> 0, max-height 120px -> 0px, padding -> 0px over 300ms ease-out
  const handleRemoveItem = (id: number) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(async () => {
      try {
        await removeItem(id);
      } finally {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }, 300);
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    try {
      setValidatingPromo(true);
      setPromoError(null);
      const res = await api.validateDiscount(promoCode, subtotal);
      if (res.valid) {
        setPromoDiscount(res.calculated_discount);
        setPromoApplied(res.code);
        setPromoCode('');
      } else {
        setPromoError(res.message);
      }
    } catch (err: any) {
      setPromoError(err.message || 'Invalid code');
    } finally {
      setValidatingPromo(false);
    }
  };

  const finalTotal = Math.max(0, subtotal - promoDiscount);

  const handleProceedToCheckout = () => {
    closeCart();
    onNavigate('/checkout');
  };

  return (
    <>
      {/* Drawer Backdrop with blur transition */}
      <div
        className={`drawer-backdrop ${isCartOpen ? 'active' : ''}`}
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 990,
          opacity: isCartOpen ? 1 : 0,
          pointerEvents: isCartOpen ? 'auto' : 'none',
          visibility: isCartOpen ? 'visible' : 'hidden',
          transition: 'opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), visibility 300ms',
        }}
      />

      {/* Slide-out Cart Drawer ("YOUR BAG")
          Slide Mechanics: Fixed right panel (width: 420px; max-width: 100vw;)
          Open Physics: translateX(100%) -> translateX(0%) over 400ms using cubic-bezier(0.22, 1, 0.36, 1) */}
      <div
        className={`cart-drawer-panel ${isCartOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          maxWidth: '100vw',
          backgroundColor: '#ffffff',
          zIndex: 995,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-12px 0 45px rgba(0, 0, 0, 0.3)',
          willChange: 'transform',
          transform: isCartOpen ? 'translateX(0%)' : 'translateX(100%)',
          transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1), visibility 400ms',
          visibility: isCartOpen ? 'visible' : 'hidden',
          pointerEvents: isCartOpen ? 'auto' : 'none',
        }}
      >
        {/* Stagger Item 1: Header (0ms stagger) */}
        <div
          className="cart-stagger-node"
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e7e5e3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            animation: isCartOpen ? 'cartStaggerSlideUp 350ms cubic-bezier(0.16, 1, 0.3, 1) 0ms both' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
              }}
            >
              YOUR BAG
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#6b6b6b',
                fontWeight: 700,
              }}
            >
              ({cart?.item_count || 0})
            </span>
          </div>

          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0a0a0a',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stagger Item 2: Dynamic Free Shipping Progress Bar (50ms stagger) */}
        <div
          className={`cart-shipping-banner ${isUnlocked ? 'threshold-unlocked' : ''}`}
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #e7e5e3',
            animation: isCartOpen ? 'cartStaggerSlideUp 350ms cubic-bezier(0.16, 1, 0.3, 1) 50ms both' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 'clamp(0.6875rem, 2.5vw, 0.75rem)',
              fontWeight: 800,
              marginBottom: '6px',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#000000',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isUnlocked && <Sparkles size={13} color="#000000" />}
              {isUnlocked
                ? "You've unlocked free shipping!"
                : `Add ${formatPrice(amountNeeded)} for free shipping`}
            </span>
            <span style={{ color: '#000000', fontFamily: 'var(--font-mono)', flexShrink: 0, fontWeight: 700 }}>
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Progress Bar Track */}
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e5e5e5',
              overflow: 'hidden',
            }}
          >
            {/* Dynamic Fill Bar: Pure stark black */}
            <div
              style={{
                width: `${animatedPercent}%`,
                height: '100%',
                backgroundColor: '#000000',
                transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>

        {/* Stagger Item 3: Body Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {!cart || cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <ShoppingBag size={48} color="#b5b5b5" style={{ margin: '0 auto 1.5rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 800 }}>
                YOUR BAG IS EMPTY
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', marginBottom: '1.75rem' }}>
                Discover our high-output compression pieces and heavyweight lowers.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  onNavigate('/collections/premium-compressions');
                }}
                className="btn-primary"
              >
                EXPLORE ACTIVEWEAR
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.items.map((item, idx) => {
                const isRemoving = removingIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`cart-item-row ${isRemoving ? 'collapsing' : ''}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr',
                      gap: '1rem',
                      // Cart Item Removal Collapse Physics:
                      // fade opacity 1 -> 0, max-height 120px -> 0px, padding -> 0px over 300ms ease-out
                      maxHeight: isRemoving ? '0px' : '135px',
                      opacity: isRemoving ? 0 : 1,
                      paddingBottom: isRemoving ? '0px' : '1.25rem',
                      paddingTop: '0px',
                      borderBottom: isRemoving ? 'none' : '1px solid #f0efed',
                      overflow: 'hidden',
                      transition: 'max-height 300ms ease-out, opacity 300ms ease-out, padding 300ms ease-out',
                      // Staggered Content Entrance: 50ms stagger delay between items
                      animation: isCartOpen
                        ? `cartStaggerSlideUp 350ms cubic-bezier(0.16, 1, 0.3, 1) ${100 + idx * 50}ms both`
                        : 'none',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '80px',
                        height: '105px',
                        backgroundColor: '#f7f6f4',
                        overflow: 'hidden',
                        position: 'relative',
                        borderRadius: '2px',
                      }}
                    >
                      <img
                        src={item.image_url}
                        alt={item.product_title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4
                            onClick={() => {
                              closeCart();
                              onNavigate(`/products/${item.product_slug}`);
                            }}
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              lineHeight: 1.3,
                              color: '#0a0a0a',
                            }}
                          >
                            {item.product_title}
                          </h4>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#9e9e9e',
                              padding: '2px',
                              transition: 'color 0.2s ease',
                            }}
                            title="Remove item"
                            aria-label={`Remove ${item.product_title}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <p style={{ fontSize: '0.75rem', color: '#6b6b6b', marginTop: '4px' }}>
                          Color: {item.color} • Size: {item.size}
                        </p>
                        <p style={{ fontSize: '0.6875rem', color: '#9e9e9e', fontFamily: 'monospace' }}>
                          SKU: {item.sku}
                        </p>
                      </div>

                      {/* Quantity & Price */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #e7e5e3',
                            backgroundColor: '#ffffff',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{
                              border: 'none',
                              background: 'none',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                            }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, padding: '0 8px' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.available_quantity}
                            style={{
                              border: 'none',
                              background: 'none',
                              padding: '4px 10px',
                              cursor: item.quantity >= item.available_quantity ? 'not-allowed' : 'pointer',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              color: item.quantity >= item.available_quantity ? '#ccc' : '#0a0a0a',
                            }}
                          >
                            +
                          </button>
                        </div>

                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0a0a0a' }}>
                          {formatPrice(item.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stagger Item 4: Footer Summary & Checkout */}
        {cart && cart.items.length > 0 && (
          <div
            className="cart-drawer-footer"
            style={{
              padding: '1.5rem',
              borderTop: '1px solid #e7e5e3',
              backgroundColor: '#faf9f8',
              animation: isCartOpen ? 'cartStaggerSlideUp 350ms cubic-bezier(0.16, 1, 0.3, 1) 250ms both' : 'none',
            }}
          >
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE (e.g. FIRST10)"
                  className="input-editorial"
                  style={{ fontSize: '0.75rem', padding: '0.6rem 0.85rem' }}
                />
                <button
                  type="submit"
                  disabled={validatingPromo}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}
                >
                  APPLY
                </button>
              </div>
              {promoError && (
                <p style={{ color: 'var(--color-campaign-red)', fontSize: '0.6875rem', marginTop: '4px' }}>
                  {promoError}
                </p>
              )}
              {promoApplied && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginTop: '6px',
                  }}
                >
                  <Tag size={13} />
                  <span>Code {promoApplied} applied (-{formatPrice(promoDiscount)})</span>
                </div>
              )}
            </form>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: '#0a0a0a' }}>{formatPrice(subtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-campaign-red)' }}>
                  <span>Discount ({promoApplied})</span>
                  <span style={{ fontWeight: 700 }}>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                <span>Pan-India Express Shipping</span>
                <span style={{ fontWeight: 700, color: isUnlocked ? '#10b981' : '#0a0a0a' }}>
                  {isUnlocked ? 'COMPLIMENTARY' : 'Calculated at checkout'}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #e7e5e3',
                  paddingTop: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 900,
                  color: '#0a0a0a',
                }}
              >
                <span>ESTIMATED TOTAL</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '0.875rem',
                letterSpacing: '0.14em',
              }}
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={18} />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '1rem',
                fontSize: '0.6875rem',
                color: '#6b6b6b',
              }}
            >
              <ShieldCheck size={14} color="#10b981" />
              <span>Complimentary 7-Day Size Swap • Pan-India Express Delivery</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cartStaggerSlideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .cart-shipping-banner.threshold-unlocked {
          animation: thresholdFlash 800ms ease-out forwards;
        }

        @keyframes thresholdFlash {
          0% {
            background-color: #f7f6f4;
          }
          30% {
            background-color: #8A0303;
            color: #ffffff;
          }
          60% {
            background-color: #ffffff;
            color: #8A0303;
          }
          100% {
            background-color: #fef2f2;
            color: #0a0a0a;
          }
        }

        .threshold-scale-bump {
          animation: scaleBump 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes scaleBump {
          0% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1.0);
          }
        }
      `}</style>
    </>
  );
};
