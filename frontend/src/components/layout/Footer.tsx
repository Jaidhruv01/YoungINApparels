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
          <div style={{ maxWidth: '420px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '0.18em',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              YOUNGIN<span style={{ color: '#b51224' }}>APPARELS</span>
            </span>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#9e9e9e',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
              }}
            >
              Direct-to-consumer atelier defined by sculptural brutalist silhouettes, 850GSM European wools, and 14oz Japanese shuttle-loom denim. Made in limited batches with zero compromise on craftsmanship.
            </p>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="eyebrow" style={{ color: '#b51224' }}>
                PARIS • TOKYO • NEW YORK • MILAN
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
              THE ARCHIVE DISPATCH
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#9e9e9e', marginBottom: '1.25rem' }}>
              Subscribe for private atelier previews, limited capsule releases, and invitations. Receive 10% off your initial acquisition.
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
                >
                  {submitting ? '...' : <ArrowRight size={16} />}
                </button>
              </form>
            )}
            <p style={{ fontSize: '0.6875rem', color: '#666666', marginTop: '0.75rem' }}>
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
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
          {/* Col 1: Collections */}
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
                { label: 'AW 26 Campaign', path: '/collections/autumn-winter-26' },
                { label: 'Outerwear & Coats', path: '/collections/outerwear' },
                { label: 'Heavyweight Fleece', path: '/collections/fleece-hoodies' },
                { label: 'Japanese Raw Denim', path: '/collections/denim' },
                { label: 'Knitwear & Scarves', path: '/collections/knitwear' },
                { label: 'Modular Accessories', path: '/collections/accessories' },
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
                { label: 'Shipping & Delivery', path: '/shipping-returns' },
                { label: 'Returns & Exchanges', path: '/shipping-returns' },
                { label: 'Atelier Sizing Guide', path: '/size-guide' },
                { label: 'Frequently Asked Questions', path: '/faq' },
                { label: 'Contact Client Care', path: '/contact' },
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

          {/* Col 3: The Brand */}
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
              THE ATELIER
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Brand Story & Manifesto', path: '/about' },
                { label: 'Shoppable Lookbook', path: '/lookbook' },
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

          {/* Col 4: Socials & Atelier Hours */}
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
              780 Fifth Avenue, Suite 1400<br />
              New York, NY 10022<br />
              care@younginapparels.com
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['INSTAGRAM', 'TIKTOK', 'PINTEREST'].map((social) => (
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
            © {new Date().getFullYear()} YOUNGIN APPARELS INC. ALL RIGHTS RESERVED.
          </div>

          {/* Payment Badges */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {['VISA', 'MASTERCARD', 'AMEX', 'APPLE PAY', 'SHOP PAY', 'RAZORPAY'].map((badge) => (
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
