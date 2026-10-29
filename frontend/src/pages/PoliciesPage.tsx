import React from 'react';

interface PoliciesPageProps {
  type: 'shipping' | 'privacy' | 'terms' | 'size-guide';
  onNavigate: (path: string) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ type, onNavigate }) => {
  const content = {
    shipping: {
      title: 'PAN-INDIA SHIPPING, EXPRESS DISPATCH & SIZE SWAP POLICY',
      eyebrow: 'ATHLETE LOGISTICS // INDIA',
      body: (
        <>
          <h3>1. PAN-INDIA DISPATCH PROTOCOLS</h3>
          <p>
            All YoungIN Apparels orders are packaged and fulfilled by our dedicated athletic dispatch facilities at Industrial Area Phase II, Chandigarh and BKC, Mumbai, India. Orders placed Monday through Saturday before 15:00 IST are dispatched on the same day. Orders placed on Sunday are fulfilled the following business morning.
          </p>
          <h3>2. COURIER TIERS & COMPLIMENTARY SHIPPING</h3>
          <p>
            • <strong>Pan-India Express Air (Delhivery / Bluedart / DTDC):</strong> 2 to 3 business days for metro cities (Mumbai, New Delhi, Bengaluru, Hyderabad, Chennai, Pune, Kolkata); 3 to 5 business days for tier-2/3 regions. Complimentary on all orders exceeding ₹1,999.00. Flat rate of ₹149.00 for orders under ₹1,999.00.<br />
            • <strong>Same-Day Mumbai Express:</strong> Available for select Mumbai pin codes. Dispatched directly from our BKC facility.
          </p>
          <h3>3. 7-DAY HASSLE-FREE SIZE SWAP & RETURNS</h3>
          <p>
            We accommodate size exchanges and returns within 7 calendar days of confirmed delivery. We understand that finding the exact compression fit or lower drape is crucial for training performance. Returned gear must be unwashed, unworn, and accompanied by the original tags.
          </p>
          <h3>4. INITIATING A DOORSTEP SIZE EXCHANGE</h3>
          <p>
            To initiate an instant size swap, contact our Athlete Concierge via WhatsApp at <strong>+91 98201 54821</strong> or email <strong>care@younginapparels.com</strong> with your order identifier (YIN-XXXXX) and required size. Our courier will deliver the replacement size to your doorstep while simultaneously picking up the returned piece.
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
            YoungIN Apparels India respects your privacy. We collect only information essential to fulfill client orders, maintain secure account records, and deliver requested athletic dispatch drop notifications.
          </p>
          <h3>2. PAYMENT CREDENTIAL ENCRYPTION</h3>
          <p>
            We do not store payment card credentials or UPI PIN numbers on our application servers. All transactions are securely processed through PCI-DSS Level 1 certified Indian payment processing networks (Razorpay, UPI, RuPay, Net Banking).
          </p>
          <h3>3. ZERO THIRD-PARTY DATA BROKERAGE</h3>
          <p>
            We do not sell, rent, or trade your personal information, phone numbers, or workout gear order histories to third-party data brokers under any circumstances.
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
            By visiting YoungIN Apparels and completing an order, you agree to these Terms and Conditions. All gear presented is subject to limited seasonal batch production.
          </p>
          <h3>2. PRICING & INVENTORY INTEGRITY</h3>
          <p>
            All prices are displayed in Indian Rupees (₹ INR) inclusive of GST. In the rare event of concurrent inventory stockouts, affected athletes will receive immediate notification and a full immediate refund to the original payment source.
          </p>
          <h3>3. INTELLECTUAL PROPERTY</h3>
          <p>
            All training campaign imagery, technical textile patterns, compression ergonomics, and brand wordmarks are proprietary intellectual property of YoungIN Apparels India.
          </p>
        </>
      ),
    },
    'size-guide': {
      title: 'ATHLETIC SIZING & PHYSIQUE MATRIX',
      eyebrow: 'ATHLETE SIZING // SPECIFICATIONS',
      body: (
        <>
          <h3>1. ATHLETIC FIT PHILOSOPHY</h3>
          <p>
            YoungIN Apparels garments are engineered for lifters, bodybuilders, and combat sports athletes. Every silhouette is cut with athletic proportions: broad shoulders, tapered waists, and ample room through the quads and glutes.
          </p>
          <h3>2. CATEGORY-SPECIFIC FIT GUIDELINES</h3>
          <p>
            • <strong>Compressions (Basic & Premium):</strong> Second-skin fit with graduated muscle support. Order your true size for supportive lockdown. If between sizes, size down for high compression or size up for mild contouring.<br />
            • <strong>270GSM Lowers:</strong> Lightweight breathable French terry with athletic taper through the calves. True to waist size.<br />
            • <strong>350GSM Lowers:</strong> Ultra-heavyweight structured fleece designed for brutal leg sessions. Features generous quad volume and snug ankle cuffs.<br />
            • <strong>Ribbed Vests & Muscle Tanks:</strong> Deep armholes and tapered physique cuts that accentuate back width and chest fullness without restricting range of motion.
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
          <h1 style={{ fontSize: 'clamp(1.5rem, 5.5vw, 3.25rem)', lineHeight: 1.15, wordBreak: 'break-word', textTransform: 'uppercase', marginBottom: '1rem', color: '#ffffff' }}>
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
              RETURN TO GYMWEAR STOREFRONT
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
