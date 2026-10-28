import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    inquiryType: 'Order Support',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', paddingBottom: '6rem' }}>
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
            ATHLETE CARE & CONCIERGE
          </span>
          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', textTransform: 'uppercase', marginBottom: '1rem', color: '#ffffff' }}>
            CONTACT YOUNGIN INDIA
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Our athlete care team in Mumbai is available to assist with sizing advice, training gear inquiries, and express dispatch status across India.
          </p>
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: '4rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 4.5rem)',
          }}
        >
          {/* Inquiry Form */}
          <div style={{ backgroundColor: '#faf9f8', border: '1px solid #e7e5e3', padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              DIRECT INQUIRY
            </h3>

            {submitted ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  INQUIRY LOGGED
                </h4>
                <p style={{ color: '#6b6b6b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  A YoungINApparels concierge specialist will reply within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem' }}
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    INQUIRY CLASSIFICATION
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="input-editorial"
                  >
                    <option value="Order Support">Order & Shipment Logistics</option>
                    <option value="Sizing">Atelier Sizing & Fit Consultation</option>
                    <option value="Press">Press & Editorial Loan</option>
                    <option value="Wholesale">Wholesale & Private Client</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    ORDER IDENTIFIER (IF APPLICABLE)
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. YIN-8291A7B2"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    MESSAGE DETAILS *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-editorial"
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '0.5rem' }}>
                  <span>TRANSMIT INQUIRY</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e3', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                DIRECT CHANNELS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Mail size={18} color="#b51224" />
                  <div>
                    <strong style={{ display: 'block' }}>Concierge Email</strong>
                    <span style={{ color: '#6b6b6b' }}>concierge@younginapparels.com</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Phone size={18} color="#b51224" />
                  <div>
                    <strong style={{ display: 'block' }}>Direct WhatsApp & Telephone</strong>
                    <span style={{ color: '#6b6b6b' }}>+91 98201 54821</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Clock size={18} color="#b51224" />
                  <div>
                    <strong style={{ display: 'block' }}>Operational Concierge Hours</strong>
                    <span style={{ color: '#6b6b6b' }}>Monday – Saturday: 09:00 – 20:00 IST</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <MapPin size={18} color="#b51224" />
                  <div>
                    <strong style={{ display: 'block' }}>Performance Logistics Hub & Dispatch</strong>
                    <span style={{ color: '#6b6b6b' }}>YoungIN Hub, Plot 42, Industrial Area Phase II, Chandigarh 160002, India</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', padding: '2rem' }}>
              <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.5rem' }}>
                ATHLETE APPOINTMENTS
              </span>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                SCHEDULE A FITTING
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#a0a0a0', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                Private showroom walkthroughs and athlete fitting sessions are available by appointment at our Mumbai Performance Studio.
              </p>
              <button
                onClick={() => alert('Private fitting concierge request noted. A stylist will reach out.')}
                className="btn-white"
                style={{ fontSize: '0.75rem', padding: '0.75rem 1.25rem' }}
              >
                REQUEST APPOINTMENT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
