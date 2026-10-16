import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface TrackOrderPageProps {
  onNavigate: (path: string) => void;
}

interface TrackingResult {
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  destination: string;
  status: 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
  milestones: { title: string; location: string; time: string; done: boolean }[];
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ onNavigate }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim() && !phoneQuery.trim()) {
      setError('Please enter your Order ID or registered mobile number.');
      return;
    }

    setSearching(true);
    setError(null);

    // Simulate instant real-time carrier lookup across India
    setTimeout(() => {
      const cleanOrder = orderQuery.trim().toUpperCase() || 'YIN-98241';
      setResult({
        orderNumber: cleanOrder.startsWith('YIN-') ? cleanOrder : `YIN-${cleanOrder}`,
        carrier: 'Delhivery Express Air',
        trackingNumber: `DELH${Math.floor(100000000 + Math.random() * 900000000)}IN`,
        destination: 'India (Pan-India Express Network)',
        status: 'Dispatched',
        estimatedDelivery: 'Within 2-3 Business Days (Express)',
        milestones: [
          {
            title: 'Order Placed & Payment Verified via UPI/Razorpay',
            location: 'YoungIN Hub, Chandigarh',
            time: 'Yesterday, 14:20 IST',
            done: true,
          },
          {
            title: 'Quality Inspected & 4-Way Stretch Compression Packaging',
            location: 'Warehouse Logistics Center, Phase II',
            time: 'Today, 09:15 IST',
            done: true,
          },
          {
            title: 'Dispatched via Air Express Courier',
            location: 'Delhivery Sorting Facility, Delhi NCR',
            time: 'Today, 15:40 IST',
            done: true,
          },
          {
            title: 'Out for Doorstep Delivery & 7-Day Size Guarantee',
            location: 'Destination Delivery Hub',
            time: 'Pending Final Transit Scan',
            done: false,
          },
        ],
      });
      setSearching(false);
    }, 600);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', paddingBottom: '6rem' }}>
      {/* Hero Header */}
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
            ATHLETE DISPATCH INTELLIGENCE // INDIA
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', textTransform: 'uppercase', marginBottom: '1rem', color: '#ffffff' }}>
            TRACK YOUR GEAR DISPATCH
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto' }}>
            Real-time pan-India tracking for your compressions, 350GSM joggers, and training vests fulfilled from our Chandigarh operations hub.
          </p>
        </div>
      </div>

      {/* Lookup Container */}
      <div className="container-narrow" style={{ paddingTop: '3.5rem' }}>
        <div
          style={{
            backgroundColor: '#faf9f8',
            border: '1px solid #e7e5e3',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            marginBottom: '3rem',
          }}
        >
          <form onSubmit={handleTrack}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  ORDER ID (E.G. YIN-XXXXX)
                </label>
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="YIN-XXXXX"
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    border: '1px solid #d4d2cf',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  OR MOBILE NUMBER (+91)
                </label>
                <input
                  type="text"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  placeholder="98XXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '0.9rem 1rem',
                    border: '1px solid #d4d2cf',
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b51224', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={searching}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '0.8125rem',
              }}
            >
              <Search size={16} />
              <span>{searching ? 'QUERYING AIR TRANSIT NODES...' : 'TRACK SHIPMENT'}</span>
            </button>
          </form>
        </div>

        {/* Tracking Live Result Card */}
        {result && (
          <div
            style={{
              border: '2px solid #0a0a0a',
              backgroundColor: '#ffffff',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid #e7e5e3',
                marginBottom: '2rem',
              }}
            >
              <div>
                <span className="eyebrow" style={{ color: '#b51224', fontSize: '0.6875rem' }}>
                  ACTIVE DISPATCH // INDIA
                </span>
                <h3 style={{ fontSize: '1.5rem', marginTop: '4px', textTransform: 'uppercase' }}>
                  ORDER {result.orderNumber}
                </h3>
                <p style={{ color: '#666666', fontSize: '0.8125rem', marginTop: '2px' }}>
                  Courier: <strong>{result.carrier}</strong> • AWB: <code style={{ backgroundColor: '#f0efed', padding: '2px 6px' }}>{result.trackingNumber}</code>
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    backgroundColor: '#0a0a0a',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  STATUS: {result.status}
                </span>
                <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.8125rem', marginTop: '6px' }}>
                  Est. Delivery: {result.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Milestones timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '2rem' }}>
              {/* Vertical line indicator */}
              <div
                style={{
                  position: 'absolute',
                  left: '11px',
                  top: '10px',
                  bottom: '25px',
                  width: '2px',
                  backgroundColor: '#e7e5e3',
                  zIndex: 0,
                }}
              />

              {result.milestones.map((m, idx) => (
                <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {/* Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-2rem',
                      top: '2px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: m.done ? '#b51224' : '#e7e5e3',
                      border: '3px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                    }}
                  >
                    {m.done && <CheckCircle2 size={12} color="#ffffff" />}
                  </div>

                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase', color: m.done ? '#0a0a0a' : '#888888' }}>
                    {m.title}
                  </h4>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#666666' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#b51224" />
                      {m.location}
                    </span>
                    <span>•</span>
                    <span>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Assistance banner */}
            <div
              style={{
                marginTop: '2.5rem',
                padding: '1.25rem',
                backgroundColor: '#f7f6f4',
                borderLeft: '4px solid #b51224',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: '#0a0a0a' }}>
                  Need Immediate Sizing Swap or Address Correction?
                </p>
                <p style={{ fontSize: '0.75rem', color: '#666666', marginTop: '2px' }}>
                  Our athlete care desk is on WhatsApp (+91 98201 54821) ready to assist you.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/contact')}
                className="btn-primary"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem' }}
              >
                <span>CONTACT DESK</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
