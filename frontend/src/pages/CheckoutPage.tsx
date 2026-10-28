import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { CheckoutQuote } from '../types';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, refreshCart } = useCart();
  const { formatPrice } = useCurrency();

  // Form Fields (English with Indian Context)
  const [email, setEmail] = useState('collector@younginapparels.com');
  const [firstName, setFirstName] = useState('Alexander');
  const [lastName, setLastName] = useState('Vance');
  const [phone, setPhone] = useState('+91 98201 54821');
  const [address1, setAddress1] = useState('74 Hill Road, Bandra West');
  const [address2, setAddress2] = useState('Floor 8');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('400050');
  const [country, setCountry] = useState('India');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'credit_card' | 'net_banking'>('razorpay');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Quote from server
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch verified quote whenever items, shipping method, or promo changes
  const fetchQuote = async () => {
    if (!cart || cart.items.length === 0) return;
    try {
      const payloadItems = cart.items.map((i) => ({
        variant_id: i.variant_id,
        quantity: i.quantity,
        price: i.price,
        product_title: i.product_title,
        sku: i.sku,
        color: i.color,
        size: i.size,
      }));
      const quoteData = await api.getCheckoutQuote({
        items: payloadItems,
        shipping_method: shippingMethod,
        discount_code: appliedPromo || undefined,
      });
      setQuote(quoteData);
    } catch (err: any) {
      console.error('Failed to get quote:', err);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, [cart, shippingMethod, appliedPromo]);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim() || !cart) return;

    try {
      setError(null);
      const res = await api.validateDiscount(promoCode, cart.subtotal);
      if (res.valid) {
        setAppliedPromo(res.code);
        setPromoMessage(`Promo code ${res.code} applied successfully!`);
        setPromoCode('');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid promo code');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;

    try {
      setSubmitting(true);
      setError(null);

      const payloadItems = cart.items.map((i) => ({
        variant_id: i.variant_id,
        quantity: i.quantity,
        price: i.price,
        product_title: i.product_title,
        sku: i.sku,
        color: i.color,
        size: i.size,
        image_url: i.image_url,
        total_price: i.total_price,
      }));

      const newOrder = await api.createOrder({
        session_id: cart.session_id,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        address1,
        address2,
        city,
        state,
        postal_code: postalCode,
        country,
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        discount_code: appliedPromo || undefined,
        items: payloadItems,
      });

      await refreshCart();
      onNavigate(`/order-confirmation/${newOrder.order_number}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please review your details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-custom" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          YOUR SHOPPING BAG IS EMPTY
        </h2>
        <p style={{ color: '#6b6b6b', marginBottom: '2rem' }}>
          Please select pieces from our archive before checking out.
        </p>
        <button onClick={() => onNavigate('/collections')} className="btn-primary">
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Checkout Minimal Header */}
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', padding: '1.25rem 0' }}>
        <div className="container-custom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            onClick={() => onNavigate('/')}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.2rem',
              fontWeight: 900,
              letterSpacing: '0.16em',
              cursor: 'pointer',
            }}
          >
            YOUNGIN<span style={{ color: '#b51224' }}>APPARELS</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#aaaaaa' }}>
            <Lock size={14} color="#10b981" />
            <span>256-BIT ENCRYPTED ATELIER CHECKOUT</span>
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: '3rem' }}>
        <form onSubmit={handlePlaceOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: 'clamp(1.5rem, 4vw, 4.5rem)',
              alignItems: 'start',
            }}
          >
            {/* Left Column: Contact, Shipping, Payment */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Section 1: Contact */}
              <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                  1. CONTACT INFORMATION
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      EMAIL ADDRESS FOR DISPATCH CONFIRMATION *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      MOBILE TELEPHONE (FOR DHL SMS UPDATES)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Address */}
              <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                  2. ATELIER DELIVERY DESTINATION
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      FIRST NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      LAST NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      STREET ADDRESS *
                    </label>
                    <input
                      type="text"
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      APARTMENT, SUITE, ETC. (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      STATE / REGION *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      POSTAL CODE *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="input-editorial"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      COUNTRY *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="input-editorial"
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="Japan">Japan</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Shipping Method */}
              <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                  3. COURIER LOGISTICS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      border: shippingMethod === 'standard' ? '2px solid #0a0a0a' : '1px solid #e7e5e3',
                      cursor: 'pointer',
                      backgroundColor: shippingMethod === 'standard' ? '#faf9f8' : '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                      />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, display: 'block' }}>
                          DHL STANDARD ARCHIVE DISPATCH (3-5 BUSINESS DAYS)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                          Complimentary on orders over ₹5,000. Real-time SMS tracking included.
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                      {quote?.free_shipping_eligible ? 'FREE' : formatPrice(350.0)}
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      border: shippingMethod === 'express' ? '2px solid #0a0a0a' : '1px solid #e7e5e3',
                      cursor: 'pointer',
                      backgroundColor: shippingMethod === 'express' ? '#faf9f8' : '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                      />
                      <div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 800, display: 'block' }}>
                          BLUEDART / DHL PRIORITY EXPRESS AIR (1-2 BUSINESS DAYS)
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                          Expedited atelier packaging with dedicated concierge handoff
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                      {formatPrice(750.0)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 4: Payment Simulation */}
              <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e7e5e3' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                  4. PAYMENT ARCHITECTURE
                </h3>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '1.5rem' }}>
                  {[
                    { id: 'razorpay', label: 'RAZORPAY / UPI' },
                    { id: 'credit_card', label: 'CARD' },
                    { id: 'net_banking', label: 'NET BANKING' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id as any)}
                      style={{
                        flex: '1 1 95px',
                        minWidth: '85px',
                        padding: '0.75rem 0.5rem',
                        border: paymentMethod === p.id ? '2px solid #0a0a0a' : '1px solid #e7e5e3',
                        backgroundColor: paymentMethod === p.id ? '#0a0a0a' : '#ffffff',
                        color: paymentMethod === p.id ? '#ffffff' : '#0a0a0a',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'razorpay' && (
                  <div style={{ padding: '1.5rem', backgroundColor: '#faf9f8', border: '1px solid #e7e5e3', textAlign: 'center' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '6px' }}>
                      INSTANT UPI & SCAN-AND-PAY GATEWAY
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                      Supports Google Pay, PhonePe, Paytm, BHIM, and all verified Indian UPI apps.
                    </p>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        CARD NUMBER (VISA, MASTERCARD, RUPAY, AMEX)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="input-editorial"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        EXPIRY DATE
                      </label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="input-editorial"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        SECURITY CODE (CVV)
                      </label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="input-editorial"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'net_banking' && (
                  <div style={{ padding: '1.5rem', backgroundColor: '#faf9f8', border: '1px solid #e7e5e3', textAlign: 'center' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.875rem', marginBottom: '6px' }}>
                      INDIAN MAJOR BANKS DIRECT CLEARING
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                      HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Kotak Mahindra.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Placement */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e7e5e3',
                padding: '2rem',
                position: 'sticky',
                top: '90px',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                ORDER OVERVIEW ({cart.item_count})
              </h3>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {cart.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={item.image_url}
                      alt={item.product_title}
                      style={{ width: '60px', height: '80px', objectFit: 'cover', backgroundColor: '#f7f6f4' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {item.product_title}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                        {item.color} • {item.size} • Qty: {item.quantity}
                      </p>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                        {formatPrice(item.total_price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div style={{ borderTop: '1px solid #e7e5e3', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="PROMO CODE (e.g. RADIAN15)"
                    className="input-editorial"
                    style={{ fontSize: '0.75rem', padding: '0.6rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="btn-secondary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}
                  >
                    APPLY
                  </button>
                </div>
                {promoMessage && (
                  <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '6px', fontWeight: 700 }}>
                    {promoMessage}
                  </p>
                )}
                {error && (
                  <p style={{ color: '#b51224', fontSize: '0.75rem', marginTop: '6px' }}>
                    {error}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', borderTop: '1px solid #e7e5e3', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: '#0a0a0a' }}>
                    {formatPrice(quote?.subtotal || cart.subtotal)}
                  </span>
                </div>
                {quote && quote.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b51224' }}>
                    <span>Promotion ({appliedPromo})</span>
                    <span style={{ fontWeight: 800 }}>-{formatPrice(quote.discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                  <span>Pan-India Courier Delivery</span>
                  <span style={{ fontWeight: 700, color: '#0a0a0a' }}>
                    {quote?.shipping === 0 ? 'FREE (OVER ₹1,999)' : formatPrice(quote?.shipping || 149)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                  <span>Standard Domestic GST (12%)</span>
                  <span style={{ fontWeight: 700, color: '#0a0a0a' }}>
                    {formatPrice(quote?.tax || 0)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '2px solid #0a0a0a',
                    paddingTop: '0.85rem',
                    fontSize: '1.15rem',
                    fontWeight: 900,
                  }}
                >
                  <span>TOTAL DUE</span>
                  <span style={{ color: '#b51224' }}>
                    {formatPrice(quote?.total || cart.subtotal)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-crimson"
                style={{ width: '100%', padding: '1.1rem', fontSize: '0.875rem' }}
              >
                <span>{submitting ? 'AUTHORIZING TRANSACTION...' : 'COMPLETE ACQUISITION'}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '1.25rem', fontSize: '0.6875rem', color: '#888' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Pan-India Express Logistics (Delhivery / Bluedart / DTDC)</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
