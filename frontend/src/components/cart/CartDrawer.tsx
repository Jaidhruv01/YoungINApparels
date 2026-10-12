import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const { formatPrice } = useCurrency();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart?.subtotal || 0;
  const freeThreshold = cart?.free_shipping_threshold || 5000;
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);
  const amountNeeded = Math.max(0, freeThreshold - subtotal);

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
      {/* Backdrop */}
      <div className="drawer-backdrop active" onClick={closeCart} />

      {/* Slide-out Drawer */}
      <div className="cart-drawer-panel open" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e7e5e3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
              }}
            >
              YOUR SHOPPING BAG
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#f7f6f4',
            borderBottom: '1px solid #e7e5e3',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '6px' }}>
            <span>
              {progressPercent >= 100
                ? 'COMPLIMENTARY EXPRESS SHIPPING UNLOCKED'
                : `ADD ${formatPrice(amountNeeded)} FOR FREE SHIPPING`}
            </span>
            <span style={{ color: '#b51224' }}>{Math.round(progressPercent)}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#e5e3df', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: progressPercent >= 100 ? '#10b981' : '#b51224',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Body Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {!cart || cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <ShoppingBag size={48} color="#b5b5b5" style={{ margin: '0 auto 1.5rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Your bag is empty
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', marginBottom: '1.75rem' }}>
                Explore the latest collection pieces from the Winter Archive.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  onNavigate('/collections/autumn-winter-26');
                }}
                className="btn-primary"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '1rem',
                    paddingBottom: '1.5rem',
                    borderBottom: '1px solid #f0efed',
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
                          }}
                        >
                          {item.product_title}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#9e9e9e',
                            padding: '2px',
                          }}
                          title="Remove item"
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
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

                      <span style={{ fontSize: '0.875rem', fontWeight: 800 }}>
                        {formatPrice(item.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart && cart.items.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid #e7e5e3',
              backgroundColor: '#faf9f8',
            }}
          >
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE (e.g. RADIAN15)"
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
                <p style={{ color: '#b51224', fontSize: '0.6875rem', marginTop: '4px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b51224' }}>
                  <span>Discount ({promoApplied})</span>
                  <span style={{ fontWeight: 700 }}>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                <span>Shipping</span>
                <span>{progressPercent >= 100 ? 'COMPLIMENTARY' : 'Calculated at checkout'}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #e7e5e3',
                  paddingTop: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 900,
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
              <span>Complimentary Returns • 100% Carbon Neutral Courier</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
