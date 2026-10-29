import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribedMessage, setSubscribedMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      setSubmitting(true);
      const res = await api.subscribeNewsletter(email);
      setSubscribedMessage(res.message);
      setEmail('');
    } catch (err: any) {
      alert(err.message || 'Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        borderTop: '1px solid #141414',
        paddingTop: '5rem',
        paddingBottom: '3rem',
      }}
    >
      <div className="container-custom">
        {/* Top Section: Brand Statement & Newsletter */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3.5rem',
            marginBottom: '4.5rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid #141414',
          }}
        >
          {/* Brand Manifesto */}
          <div style={{ maxWidth: '440px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 4vw, 1.4rem)',
                fontWeight: 900,
                letterSpacing: '0.14em',
                display: 'block',
                marginBottom: '0.85rem',
              }}
            >
              YOUNG<span style={{ color: 'var(--color-campaign-red)' }}>IN</span> APPARELS
            </span>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#9e9e9e',
                lineHeight: 1.65,
                marginBottom: '1.25rem',
              }}
            >
              Direct-to-consumer activewear defined by industrial aesthetics and elite performance. Engineered in India with zero compromise on craftsmanship.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="eyebrow" style={{ color: 'var(--color-campaign-red)', fontSize: '0.6875rem', letterSpacing: '0.12em', lineHeight: 1.5 }}>
                PROUDLY ENGINEERED & MANUFACTURED IN INDIA • PAN-INDIA EXPRESS SHIPPING
              </span>
            </div>
          </div>

          {/* Newsletter Dispatch */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                marginBottom: '0.75rem',
              }}
            >
              THE ATHLETE DISPATCH
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#9e9e9e', marginBottom: '1.25rem' }}>
              Subscribe for private drop previews, restocking alerts on 350GSM joggers, and athlete training discounts. Receive 10% off your initial acquisition.
            </p>

            {subscribedMessage ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#4ade80',
                  fontSize: '0.8125rem',
                  padding: '0.75rem 0',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{subscribedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: '440px' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  required
                  className="input-editorial-dark"
                  style={{
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                  }}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-crimson"
                  style={{
                    padding: '0.75rem 1.25rem',
                    flexShrink: 0,
                  }}
                  aria-label="Subscribe"
                >
                  {submitting ? '...' : <ArrowRight size={16} />}
                </button>
              </form>
            )}
            <p style={{ fontSize: '0.6875rem', color: '#666666', marginTop: '0.75rem' }}>
              By subscribing, you agree to our Privacy Policy and consent to receive training drop alerts.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '4rem',
          }}
        >
          {/* Col 1: Gymwear Categories */}
          <div>
            <h5
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              COLLECTIONS
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Premium Compression Tees', path: '/collections/premium-compressions' },
                { label: 'Basic Compression Tees', path: '/collections/basic-compressions' },
                { label: 'Heavyweight Joggers (350GSM)', path: '/collections/350gsm-lowers' },
                { label: 'Training Joggers (250GSM)', path: '/collections/250gsm-lowers' },
                { label: 'Premium Tank Tops', path: '/collections/tank-tops' },
                { label: 'Training Vests', path: '/collections/ribbed-vests' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#9e9e9e',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9e9e9e')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Client Services */}
          <div>
            <h5
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              CLIENT SERVICES
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Shipping & Delivery (3-5 Day Express)', path: '/shipping-returns' },
                { label: 'Returns & Exchanges', path: '/shipping-returns' },
                { label: 'Size Guide', path: '/size-guide' },
                { label: 'Track Your Order', path: '/track-order' },
                { label: 'Contact Support', path: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#9e9e9e',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9e9e9e')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Brand & Legal */}
          <div>
            <h5
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              YOUNGIN BRAND
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Brand Story & Philosophy', path: '/about' },
                { label: 'Track My Order', path: '/track-order' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Admin Console', path: '/admin' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#9e9e9e',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#9e9e9e')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Indian HQ & Dispatch */}
          <div>
            <h5
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              DISPATCH OFFICE
            </h5>
            <p style={{ fontSize: '0.8125rem', color: '#9e9e9e', lineHeight: 1.6, marginBottom: '1rem' }}>
              YoungIN Performance Logistics Hub<br />
              Plot 42, Industrial Area Phase II<br />
              Chandigarh 160002, India<br />
              <span style={{ color: '#ffffff', fontWeight: 600, wordBreak: 'break-all' }}>care@younginapparels.com</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.85rem' }}>
              <span style={{ fontSize: '0.625rem', color: '#6b6b6b', letterSpacing: '0.08em', fontWeight: 800 }}>
                ATHLETE NETWORK & CONCIERGE:
              </span>
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                {[
                  { name: 'INSTAGRAM', handle: '@youngin.apparel' },
                  { name: 'YOUTUBE', handle: '@youngin.apparel' },
                  { name: 'WHATSAPP', handle: '+91 98201 54821' },
                ].map((social) => (
                  <span
                    key={social.name}
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      color: '#a3a3a3',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a3a3a3')}
                    title={`${social.name}: ${social.handle}`}
                  >
                    {social.name} <span style={{ color: 'var(--color-campaign-red)', fontSize: '0.625rem' }}>({social.handle})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Domestic Payment Gateways */}
        <div
          className="footer-bottom-bar"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid #181818',
            fontSize: '0.75rem',
            color: '#666666',
          }}
        >
          <div>
            © {new Date().getFullYear()} YOUNGIN APPARELS INDIA. ALL RIGHTS RESERVED.
          </div>

          {/* Indian Payment Gateways - Prominently Advertising UPI */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            {/* Featured UPI Pill */}
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 900,
                letterSpacing: '0.06em',
                backgroundColor: 'var(--color-campaign-red)',
                color: '#ffffff',
                border: '1px solid var(--color-deep-red)',
                padding: '3px 8px',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ⚡ UPI INSTANT
            </span>

            {['GPAY', 'PHONEPE', 'PAYTM', 'RAZORPAY', 'RUPAY', 'VISA', 'MASTERCARD', 'NET BANKING'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: '#a3a3a3',
                  backgroundColor: '#121212',
                  border: '1px solid #282828',
                  padding: '3px 6px',
                  borderRadius: '2px',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Section 10: Massive Outlined Brand Footer Wordmark */}
        <div className="footer-wordmark-container" style={{ width: '100%', overflow: 'hidden', textAlign: 'center' }}>
          <span className="footer-wordmark-text" style={{ whiteSpace: 'nowrap', display: 'block' }}>
            YOUNGIN
          </span>
        </div>
      </div>
    </footer>
  );
};
