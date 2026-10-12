import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'HOW DO YOUNGINAPPARELS GARMENTS FIT COMPARED TO STANDARD SIZING?',
      a: 'Our silhouettes are cut with intentional architectural volume, featuring dropped shoulders and relaxed chest proportions. If you desire the editorial, runway-draped silhouette depicted in our campaign imagery, order your standard size. If you prefer a traditional, conventional fit, we recommend selecting one size smaller.',
    },
    {
      q: 'WHAT MATERIALS ARE USED IN THE 500GSM FLEECE AND TAILORING?',
      a: 'Our fleece is custom-knit in Portugal from 100% organic long-staple cotton at an ultra-dense 500GSM weight. Our overcoats are engineered in Milan from 850GSM Italian Melton wool blended with 10% pure cashmere. Our denim is sourced directly from Okayama, Japan, woven on vintage Toyoda shuttle looms with red-line selvedge IDs.',
    },
    {
      q: 'WHAT ARE YOUR WORLDWIDE SHIPPING TIME AND CARRIERS?',
      a: 'We ship nationwide and globally via Bluedart and DHL Express. Standard delivery takes 3 to 5 business days, while Priority Air takes 1 to 2 business days. Complimentary express shipping is automatically applied at checkout on all orders exceeding ₹5,000.',
    },
    {
      q: 'WHAT IS YOUR RETURN AND EXCHANGE POLICY?',
      a: 'We accept returns and size exchanges within 14 calendar days of confirmed delivery. All returned pieces must be in pristine, unworn condition with original atelier tags and dustbags attached. Return shipping is complimentary for domestic US orders.',
    },
    {
      q: 'ARE YOUR PRODUCTION DROPS RESTOCKED?',
      a: 'No. To maintain uncompromising material standards and avoid industrial waste, YoungINApparels manufactures in strictly limited archive editions. Once an archive release sells out, it will not be reproduced.',
    },
    {
      q: 'HOW DO I TRACK MY ATELIER DISPATCH?',
      a: 'Upon dispatch, you will receive an automated email containing your DHL tracking number and real-time delivery milestones. You can also view active order status at any time using our online order lookup tool or client concierge.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', paddingBottom: '6rem' }}>
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
            CLIENT INTELLIGENCE
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', textTransform: 'uppercase', marginBottom: '1rem', color: '#ffffff' }}>
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Answers regarding atelier sizing, production philosophy, international dispatch, and care instructions.
          </p>
        </div>
      </div>

      <div className="container-narrow" style={{ paddingTop: '4.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  border: '1px solid #e7e5e3',
                  backgroundColor: isOpen ? '#faf9f8' : '#ffffff',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.9375rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      color: isOpen ? '#b51224' : '#0a0a0a',
                    }}
                  >
                    {item.q}
                  </span>
                  {isOpen ? <ChevronUp size={20} color="#b51224" /> : <ChevronDown size={20} />}
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.5rem 1.5rem',
                      color: '#555555',
                      fontSize: '0.875rem',
                      lineHeight: 1.8,
                      borderTop: '1px solid #f0efed',
                      paddingTop: '1rem',
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '4rem', textAlign: 'center', padding: '2.5rem', backgroundColor: '#f7f6f4' }}>
          <h4 style={{ fontSize: '1.1rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            HAVE A QUESTION NOT ANSWERED HERE?
          </h4>
          <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', marginBottom: '1.5rem' }}>
            Our concierge team is standing by to assist with any custom inquiries.
          </p>
          <button onClick={() => onNavigate('/contact')} className="btn-primary">
            CONTACT CONCIERGE
          </button>
        </div>
      </div>
    </div>
  );
};
