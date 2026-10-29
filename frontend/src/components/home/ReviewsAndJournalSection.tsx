import React, { useState } from 'react';
import { Star, ArrowRight, Plus, Minus, MapPin } from 'lucide-react';

interface ReviewsAndJournalSectionProps {
  onNavigate: (path: string) => void;
}

export const ReviewsAndJournalSection: React.FC<ReviewsAndJournalSectionProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const reviews = [
    {
      id: 1,
      author: 'Vikram S.',
      verified: true,
      rating: 5,
      date: 'OCT 24, 2026',
      title: 'UNRIVALED 350GSM FABRIC DENSITY',
      text: 'The weight of these lowers is unlike anything else in India. Barbell knurling doesn’t damage the thighs, and the calf taper is surgically sharp.',
      item: '350GSM HEAVYWEIGHT LOWER // BLACK',
    },
    {
      id: 2,
      author: 'Arjun M.',
      verified: true,
      rating: 5,
      date: 'OCT 18, 2026',
      title: 'TRUE SECOND-SKIN COMPRESSION',
      text: 'Hyper-elastic poly-nylon that never sags after high-sweat sessions. The flatlock seams ensure zero chafing across heavy bench press sessions.',
      item: 'PRO-ARMOR COMPRESSION TEE',
    },
    {
      id: 3,
      author: 'Rohit K.',
      verified: true,
      rating: 5,
      date: 'OCT 12, 2026',
      title: 'ARCHITECTURAL SILHOUETTE',
      text: 'Extremely clean look. Transitions effortlessly from a deadlift platform to the street. Will be buying the oxblood drop immediately.',
      item: 'ARCHITECTURAL RIBBED TANK',
    },
  ];

  const articles = [
    {
      id: 1,
      title: 'THE DISCIPLINE OF HEAVY FABRICS: WHY 350GSM MATTERS',
      date: 'OCTOBER 2026',
      image: '/images/editorial-split.jpg',
      summary: 'Exploring the mechanical physics of high-density combed fleece under heavy barbell friction.',
      link: '/about',
    },
    {
      id: 2,
      title: 'POLY-NYLON MOLECULAR WEAVE: ZERO RESTRICTION',
      date: 'SEPTEMBER 2026',
      image: '/images/lookbook-campaign.jpg',
      summary: 'How 4-way elastic tension stabilizes muscle oscillations without pinching circulation.',
      link: '/about',
    },
  ];

  const stores = [
    {
      city: 'NEW DELHI',
      name: 'ATELIER FLAGSHIP & DISPATCH',
      address: 'Plot 42, Industrial Area Phase II, New Delhi',
      hours: 'Mon — Sat: 10:00 AM – 8:00 PM',
      maps: 'https://maps.google.com',
    },
    {
      city: 'MUMBAI',
      name: 'BANDRA DESIGN STUDIO',
      address: '14 Waterfield Road, Bandra West, Mumbai',
      hours: 'Mon — Sun: 11:00 AM – 9:00 PM',
      maps: 'https://maps.google.com',
    },
  ];

  const faqs = [
    {
      q: 'HOW DOES THE COMPRESSION FIT RELATIVE TO STANDARD SIZING?',
      a: 'Our compression apparel is engineered for true-to-skin high-tensile lock. If you desire competition-grade compression, select your standard size. For a relaxed athletic fit, order one size up.',
    },
    {
      q: 'WHAT ARE THE PAN-INDIA DELIVERY TIMELINES?',
      a: 'All orders are dispatched via express air courier within 24 hours from our Delhi hub. Metro cities receive parcels within 2 to 3 days. Complimentary express delivery is unlocked on orders over ₹1,999.',
    },
    {
      q: 'WHAT IS YOUR SIZE EXCHANGE GUARANTEE?',
      a: 'We offer an effortless 7-day doorstep size swap across India. If the fit requires adjustment, our concierge arranges immediate pickup and re-shipment.',
    },
    {
      q: 'HOW DO I CARE FOR 350GSM FLEECE PRODUCTS?',
      a: 'Machine wash cold inside out with neutral detergent. Hang dry in shade to maintain fleece loft and stitch integrity. Avoid high-heat tumble dryers.',
    },
  ];

  return (
    <div style={{ width: '100%', backgroundColor: '#ffffff', color: '#000000' }}>
      {/* 1. Reviews Section: 2 Columns (Sticky Left summary, Right scrolling list) (Radiant item #138) */}
      <section
        data-header-theme="light"
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 380px) 1fr',
            gap: 'clamp(2.5rem, 6vw, 6rem)',
            alignItems: 'start',
          }}
          className="reviews-two-col-layout"
        >
          {/* Left Column: Sticky Rating Summary */}
          <div
            style={{
              position: 'sticky',
              top: '100px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'inline-block',
                marginBottom: '1rem',
              }}
            >
              COMMUNITY VOICES // DISCIPLINE
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              VERIFIED{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                }}
              >
                feedback
              </span>
            </h2>

            {/* Overall Rating Block */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '3rem', fontWeight: 900 }}>4.9</span>
              <span style={{ fontSize: '1rem', color: '#666666', fontWeight: 600 }}>/ 5.0</span>
            </div>

            <div style={{ display: 'flex', gap: '3px', marginBottom: '1.25rem' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} fill="#000000" color="#000000" strokeWidth={1} />
              ))}
            </div>

            <p style={{ fontSize: '0.8125rem', color: '#666666', lineHeight: 1.6, maxWidth: '320px' }}>
              Based on over 1,400 verified athlete acquisitions across India. Crafted without compromise.
            </p>
          </div>

          {/* Right Column: Scrolling List of Individual Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  padding: '2rem',
                  border: '1px solid rgba(0,0,0,0.08)',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} fill="#000000" color="#000000" strokeWidth={1} />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#888888' }}>
                    {rev.date}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  {rev.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: '#444444', lineHeight: 1.65, marginBottom: '1rem' }}>
                  "{rev.text}"
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#666666' }}>
                  <span style={{ fontWeight: 700, color: '#000000' }}>
                    {rev.author} • <strong style={{ color: '#16a34a' }}>Verified Athlete</strong>
                  </span>
                  <span style={{ fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {rev.item}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Journal: 2-Column Article Layout (Radiant item #139) */}
      <section
        data-header-theme="light"
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem', maxWidth: '700px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              ATELIER JOURNAL // ESSAYS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              TECHNICAL{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                }}
              >
                inquiry
              </span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: '2.5rem',
            }}
          >
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate(art.link)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                className="journal-card-hover"
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 10',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                    marginBottom: '1.25rem',
                  }}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease',
                    }}
                    className="journal-img"
                  />
                </div>

                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: '#888888', marginBottom: '0.5rem' }}>
                  {art.date}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    textTransform: 'uppercase',
                    lineHeight: 1.25,
                    marginBottom: '0.65rem',
                  }}
                >
                  {art.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: '#666666', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                  {art.summary}
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                  }}
                  className="link-hover-underline"
                >
                  <span>READ ESSAY</span>
                  <ArrowRight size={14} strokeWidth={1.5} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Store Locator: Addresses, Hours, Map Link (Radiant item #140) */}
      <section
        data-header-theme="light"
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem', maxWidth: '700px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              PHYSICAL PRESENCE // STUDIOS
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              VISIT OUR{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                }}
              >
                studios
              </span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: '2rem',
            }}
          >
            {stores.map((s) => (
              <div
                key={s.city}
                style={{
                  padding: '2rem',
                  border: '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                  <MapPin size={16} strokeWidth={1.5} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    {s.city}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {s.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#666666', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  {s.address}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#888888', marginBottom: '1.5rem' }}>
                  {s.hours}
                </p>
                <a
                  href={s.maps}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: '#000000',
                    textDecoration: 'none',
                  }}
                  className="link-hover-underline"
                >
                  <span>VIEW ON MAP</span>
                  <ArrowRight size={13} strokeWidth={1.5} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ: Accordion List with + / - Rotation (Radiant item #141) */}
      <section
        data-header-theme="light"
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 5rem)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#666666',
                display: 'inline-block',
                marginBottom: '0.75rem',
              }}
            >
              SPECIFICATIONS & CARE
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              FREQUENTLY ASKED{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                }}
              >
                questions
              </span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.5rem 0',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '1.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                        color: '#000000',
                      }}
                    >
                      {f.q}
                    </span>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <Plus size={20} strokeWidth={1.5} />
                    </span>
                  </button>

                  {/* Accordion Content with smooth height transition */}
                  <div
                    style={{
                      maxHeight: isOpen ? '300px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <p style={{ fontSize: '0.875rem', color: '#555555', lineHeight: 1.7, paddingBottom: '1.5rem', margin: 0 }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .journal-card-hover:hover .journal-img {
          transform: scale(1.04);
        }
        @media (max-width: 850px) {
          .reviews-two-col-layout {
            grid-template-columns: 1fr !important;
          }
          .reviews-two-col-layout > div:first-child {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
};
