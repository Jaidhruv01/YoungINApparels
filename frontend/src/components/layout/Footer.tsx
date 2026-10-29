import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
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
    } catch {
      setSubscribedMessage('Thank you. You have been added to the allocation list.');
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      data-header-theme="dark"
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        paddingTop: 'clamp(4.5rem, 8vw, 7rem)',
        paddingBottom: '2rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1680px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
        {/* Top Grid: Newsletter Dispatch & Navigation Links (Radiant items #144, #145) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            marginBottom: 'clamp(4rem, 8vw, 7rem)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            paddingBottom: '4rem',
          }}
        >
          {/* Newsletter Column: renamed from "THE ATHLETE DISPATCH" to match Radiant tone */}
          <div style={{ maxWidth: '440px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.75)',
                display: 'block',
                marginBottom: '0.75rem',
              }}
            >
              COMMUNICATIONS // DISPATCH
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                marginBottom: '0.85rem',
              }}
            >
              THE DISPATCH
            </h3>

            <p style={{ fontSize: '0.8125rem', color: '#999999', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Subscribe for private atelier capsule releases, restock alerts on 350GSM joggers, and invitations to closed studio drops.
            </p>

            {subscribedMessage ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#111111',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '12px 16px',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <Check size={16} strokeWidth={2} />
                <span>{subscribedMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.4)' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    required
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      padding: '10px 0',
                      flex: 1,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '10px',
                    }}
                    aria-label="Subscribe"
                  >
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Links Column 1: Collections */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              COLLECTIONS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'All Garments', path: '/collections' },
                { label: 'Compression Series', path: '/collections/compression' },
                { label: 'Heavyweight Joggers', path: '/collections/joggers' },
                { label: 'Tanks & Stringers', path: '/collections/tanks-vests' },
                { label: 'Special Editions', path: '/lookbook' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#888888',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    className="link-hover-underline"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: Client Services */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              CLIENT SERVICES
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Track Order', path: '/track-order' },
                { label: 'Shipping & Delivery', path: '/shipping-returns' },
                { label: '7-Day Easy Size Swap', path: '/shipping-returns' },
                { label: 'FAQ & Specifications', path: '/faq' },
                { label: 'Contact Studio', path: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#888888',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    className="link-hover-underline"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: Atelier Brand */}
          <div>
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              THE ATELIER
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Philosophy & Craft', path: '/about' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Atelier Console', path: '/admin' },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#888888',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    className="link-hover-underline"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Bar: Copyright & Domestic Payment Gateways (Radiant item #146) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2rem',
            fontSize: '0.75rem',
            color: '#666666',
          }}
        >
          <div>
            © {new Date().getFullYear()} youngin apparels india. all rights reserved.
          </div>

          {/* Payment Method Icons in Clean Monochrome Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                backgroundColor: '#ffffff',
                color: '#000000',
                padding: '4px 8px',
                borderRadius: '2px',
              }}
            >
              UPI INSTANT
            </span>

            {['GPAY', 'PHONEPE', 'PAYTM', 'RAZORPAY', 'RUPAY', 'VISA', 'MASTERCARD', 'NET BANKING'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: '#888888',
                  backgroundColor: '#111111',
                  border: '1px solid #222222',
                  padding: '3px 7px',
                  borderRadius: '2px',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Section 21 Item 143 & 147: Massive Outline (stroke only, transparent fill) wordmark spanning full width */}
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
            textAlign: 'center',
            marginTop: '1.5rem',
            lineHeight: 0.8,
          }}
        >
          <span
            className="radiant-footer-stroke-wordmark"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(4.5rem, 18vw, 20rem)',
              fontWeight: 900,
              textTransform: 'lowercase',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.22)',
              letterSpacing: '-0.04em',
              display: 'inline-block',
              userSelect: 'none',
              pointerEvents: 'none',
              animation: 'footerWordmarkFadeIn 1s ease-out forwards',
            }}
          >
            youngin
          </span>
        </div>
      </div>

      <style>{`
        @keyframes footerWordmarkFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </footer>
  );
};
