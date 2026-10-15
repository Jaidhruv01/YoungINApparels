import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'HOW DO YOUNGIN GYMWEAR & LOWERS FIT ATHLETIC PHYSIQUES?',
      a: 'Our silhouettes are engineered specifically for lifters and athletes. Compressions fit true to skin with high-tensile muscle support. Our 270GSM and 350GSM Lowers offer generous quad and glute room with an aggressive taper at the calves and snug ribbed ankle cuffs so they never bunch up under barbell weights.',
    },
    {
      q: 'WHAT IS THE DIFFERENCE BETWEEN 270GSM AND 350GSM LOWERS?',
      a: 'Our 270GSM Lowers are crafted from lightweight, highly breathable loopback French terry ideal for high-rep training, conditioning, agility drills, and warm Indian climates. Our 350GSM Lowers are custom-milled from ultra-heavyweight dense brushed cotton fleece engineered for heavy powerlifting, cold-weather training, and structured street aesthetic.',
    },
    {
      q: 'WHAT IS THE DIFFERENCE BETWEEN BASIC AND PREMIUM COMPRESSIONS?',
      a: 'Basic Compressions use a lightweight four-way stretch poly-elastane hydrophilic microfiber designed for daily training, moisture absorption, and flexible mobility. Premium Compressions feature a high-tensile graduated nylon-elastane weave with body-mapped ventilation zones and reinforced flatlock 4-needle stitching for maximal muscle stabilization.',
    },
    {
      q: 'WHAT ARE YOUR PAN-INDIA SHIPPING TIMELINES & CHARGES?',
      a: 'We ship across all pin codes in India via Delhivery, Bluedart, and DTDC Express. Delivery to metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai) takes 2 to 3 business days, and other regions take 3 to 5 business days. Complimentary express delivery is automatically applied on all orders exceeding ₹1,999.',
    },
    {
      q: 'WHAT IS YOUR RETURN & SIZE SWAP POLICY?',
      a: 'We offer a hassle-free 7-day size swap and return policy from the date of confirmed delivery. If your lowers or compressions do not fit your physique perfectly, simply contact our Athlete Concierge via WhatsApp (+91 98201 54821) or email to arrange a doorstep size exchange.',
    },
    {
      q: 'HOW DO I CARE FOR 350GSM FLEECE AND COMPRESSIONS?',
      a: 'Machine wash cold inside out with mild sports detergent. We strongly recommend hang drying in the shade to maintain the 350GSM fabric weight and elastane elasticity. Avoid using fabric softeners on compression gear as it coats moisture-wicking pores.',
    },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', paddingBottom: '6rem' }}>
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
            ATHLETE INTELLIGENCE // INDIA
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', textTransform: 'uppercase', marginBottom: '1rem', color: '#ffffff' }}>
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Answers regarding gymwear sizing, 350GSM lowers, multi-tier compressions, pan-India express dispatch, and fabric care.
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
