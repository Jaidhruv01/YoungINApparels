import React from 'react';

interface PoliciesPageProps {
  type: 'shipping' | 'privacy' | 'terms' | 'size-guide';
  onNavigate: (path: string) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ type, onNavigate }) => {
  const content = {
    shipping: {
      title: 'SHIPPING, DISPATCH & RETURNS POLICY',
      eyebrow: 'CLIENT TERMS // LOGISTICS',
      body: (
        <>
          <h3>1. INTERNATIONAL DISPATCH PROTOCOLS</h3>
          <p>
            All YoungINApparels orders are packaged and fulfilled by our dedicated dispatch facility in New York. Orders placed Monday through Friday before 14:00 EST are processed within 24 hours. Orders placed on weekends or observed holidays are fulfilled the following business morning.
          </p>
          <h3>2. COURIER TIERS & COMPLIMENTARY SHIPPING</h3>
          <p>
            • <strong>Standard Courier (Bluedart / DHL):</strong> Estimated 3 to 5 business days delivery. Flat rate of ₹350.00 on orders under ₹5,000.00. Complimentary on all orders exceeding ₹5,000.00.<br />
            • <strong>Priority Express Air:</strong> Estimated 1 to 2 business days delivery. Flat rate of ₹750.00. Features direct concierge handoff and required delivery confirmation.
          </p>
          <h3>3. 14-DAY ATELIER RETURNS & EXCHANGES</h3>
          <p>
            We accommodate returns and size exchanges within 14 calendar days of recorded delivery. Returned pieces must be unwashed, unworn, and accompanied by the original custom archival packaging, branded hangers, and intact security tags.
          </p>
          <h3>4. INITIATING AN EXCHANGE</h3>
          <p>
            To initiate an exchange, please contact concierge@younginapparels.com with your order identifier (YIN-XXXXX). We will provide a pre-paid DHL return waybill within 2 hours.
          </p>
        </>
      ),
    },
    privacy: {
      title: 'PRIVACY POLICY & DATA INTEGRITY',
      eyebrow: 'CLIENT TERMS // LEGAL',
      body: (
        <>
          <h3>1. DATA PROTECTION COMMITMENT</h3>
          <p>
            YoungINApparels Inc. respects your privacy. We collect only information essential to fulfill client orders, maintain secure account records, and deliver requested atelier dispatch newsletters.
          </p>
          <h3>2. PAYMENT CREDENTIAL ENCRYPTION</h3>
          <p>
            We do not store complete payment card credentials or CVV numbers on application servers. All transactions are securely tokenized through PCI-DSS Level 1 certified payment processing networks (Stripe / Razorpay).
          </p>
          <h3>3. ZERO THIRD-PARTY DATA BROKERAGE</h3>
          <p>
            We do not sell, rent, or trade your personal information, email addresses, or transaction histories to third-party advertisers under any circumstance.
          </p>
        </>
      ),
    },
    terms: {
      title: 'TERMS & CONDITIONS OF SALE',
      eyebrow: 'CLIENT TERMS // GOVERNANCE',
      body: (
        <>
          <h3>1. STOREFRONT TERMS</h3>
          <p>
            By visiting YoungINApparels and completing an order, you agree to these Terms and Conditions. All pieces presented are subject to availability and limited archive stock constraints.
          </p>
          <h3>2. PRICING & INVENTORY INTEGRITY</h3>
          <p>
            Prices are displayed in your selected local currency and exclude applicable regional taxes until final checkout calculation. In the rare event of concurrent inventory stockouts, affected customers will receive immediate notification and full immediate refund.
          </p>
          <h3>3. INTELLECTUAL PROPERTY</h3>
          <p>
            All campaign imagery, tailoring patterns, architectural garment silhouettes, and brand wordmarks are proprietary intellectual properties of YoungINApparels Inc.
          </p>
        </>
      ),
    },
    'size-guide': {
      title: 'ATELIER SIZING & FIT GUIDE',
      eyebrow: 'CLIENT INTELLIGENCE // SIZING',
      body: (
        <>
          <h3>1. THE ARCHITECTURAL SILHOUETTE</h3>
          <p>
            YoungINApparels garments are engineered with relaxed, architectural drape. Outerwear and fleece feature extended shoulder seams, wide chest cuts, and precise cropped body hems.
          </p>
          <h3>2. SIZE TRANSLATION</h3>
          <p>
            • <strong>XS:</strong> Chest 36" (91cm) — Slim or fitted silhouette for 5'6" to 5'9"<br />
            • <strong>S:</strong> Chest 38" (96cm) — Structured drape for 5'8" to 5'11"<br />
            • <strong>M:</strong> Chest 40" (101cm) — Signature relaxed drape for 5'10" to 6'1"<br />
            • <strong>L:</strong> Chest 42" (106cm) — Dramatic editorial volume for 6'0" to 6'3"<br />
            • <strong>XL:</strong> Chest 44"+ (112cm+) — Maximum brutalist drape for 6'2"+
          </p>
        </>
      ),
    },
  }[type];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', paddingBottom: '6rem' }}>
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
            {content.eyebrow}
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', textTransform: 'uppercase', marginBottom: '1rem', color: '#ffffff' }}>
            {content.title}
          </h1>
        </div>
      </div>

      <div className="container-narrow" style={{ paddingTop: '4rem' }}>
        <div
          className="policy-content"
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.8,
            color: '#444444',
          }}
        >
          {content.body}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e7e5e3' }}>
            <button onClick={() => onNavigate('/collections')} className="btn-primary">
              RETURN TO ATELIER STOREFRONT
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .policy-content h3 {
          font-family: var(--font-display);
          font-size: 1.15rem;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          color: #0a0a0a;
          text-transform: uppercase;
        }
        .policy-content p {
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
};
