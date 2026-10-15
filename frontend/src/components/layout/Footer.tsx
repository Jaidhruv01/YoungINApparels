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
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        borderTop: '1px solid #1a1a1a',
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
            borderBottom: '1px solid #1c1c1c',
          }}
        >
          {/* Brand Manifesto */}
          <div style={{ maxWidth: '440px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '0.16em',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              YOUNG<span style={{ color: '#b51224' }}>IN</span> APPARELS
            </span>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#9e9e9e',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              High-performance Indian gymwear & strength apparel engineered for peak athletic output. Built with four-way stretch compressions, 350GSM heavyweight structured lowers, and contoured ribbed training vests. Engineered and dispatched across India with zero compromise.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="eyebrow" style={{ color: '#b51224', fontSize: '0.6875rem' }}>
                MUMBAI • NEW DELHI • BENGALURU • HYDERABAD • PAN-INDIA
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
              Subscribe for private drop previews, restocking alerts on 350GSM lowers, and athlete training discounts. Receive 10% off your initial acquisition.
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
              GYMWEAR GEAR
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Tank Tops', path: '/collections/tank-tops' },
                { label: 'Basic Compressions', path: '/collections/basic-compressions' },
                { label: 'Premium Compressions', path: '/collections/premium-compressions' },
                { label: 'Ribbed Vests', path: '/collections/ribbed-vests' },
                { label: '270 GSM Lowers', path: '/collections/270gsm-lowers' },
                { label: '350 GSM Heavy Lowers', path: '/collections/350gsm-lowers' },
              ].map((item) => (
                <li key={item.path}>
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

          {/* Col 2: Athlete Services */}
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
              ATHLETE SERVICES
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Pan-India Express Shipping', path: '/shipping-returns' },
                { label: '7-Day Easy Returns & Size Swap', path: '/shipping-returns' },
                { label: 'Gymwear Sizing Guide', path: '/size-guide' },
                { label: 'Frequently Asked Questions', path: '/faq' },
                { label: 'WhatsApp Concierge Support', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
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
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Admin Management', path: '/admin' },
              ].map((item) => (
                <li key={item.path}>
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
              DISPATCH HEADQUARTERS
            </h5>
            <p style={{ fontSize: '0.8125rem', color: '#9e9e9e', lineHeight: 1.6, marginBottom: '1rem' }}>
              YoungIN Performance HQ<br />
              BKC, Bandra East<br />
              Mumbai, Maharashtra 400051, India<br />
              care@younginapparels.com
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['INSTAGRAM', 'YOUTUBE', 'WHATSAPP'].map((social) => (
                <span
                  key={social}
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#6b6b6b',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6b6b6b')}
                >
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div
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

          {/* Indian Payment Gateways */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            {['UPI', 'GPAY', 'PHONEPE', 'PAYTM', 'RUPAY', 'VISA', 'MASTERCARD', 'NET BANKING'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: '#9e9e9e',
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
      </div>
    </footer>
  );
};
