import React, { useState, useEffect } from 'react';
import { Order, OrderItem } from '../types';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { CheckCircle2, Printer, ArrowRight, Check } from 'lucide-react';

interface OrderConfirmationProps {
  orderNumber: string;
  onNavigate: (path: string) => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderNumber, onNavigate }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        const data = await api.getOrderByNumber(orderNumber);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order receipt:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderNumber]);

  if (loading || !order) {
    return (
      <div className="container-custom" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p>Retrieving archival order receipt...</p>
      </div>
    );
  }

  const steps = [
    { label: 'CONFIRMED', date: 'Just now', done: true },
    { label: 'GEAR FULFILLMENT', date: 'Processing', done: order.status !== 'confirmed' },
    { label: 'IN TRANSIT (BLUEDART)', date: 'Estimated 2 Days', done: order.status === 'shipped' || order.status === 'delivered' },
    { label: 'DELIVERED', date: 'Signature required', done: order.status === 'delivered' },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '90vh', padding: '4rem 0 6rem 0' }}>
      <div className="container-narrow">
        {/* Success Banner */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#0a0a0a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <CheckCircle2 size={32} color="#ffffff" />
          </div>

          <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.5rem' }}>
            ORDER CONFIRMED & DISPATCH LOGGED
          </span>

          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.75rem)', lineHeight: 1.15, wordBreak: 'break-word', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            THANK YOU, {order.first_name}
          </h1>

          <p style={{ color: '#6b6b6b', fontSize: '0.9375rem', maxWidth: '520px', margin: '0 auto' }}>
            Your transaction has been authorized. Confirmation receipt dispatched to{' '}
            <strong style={{ color: '#0a0a0a' }}>{order.email}</strong>.
          </p>
        </div>

        {/* Order Meta Header Card */}
        <div
          style={{
            backgroundColor: '#faf9f8',
            border: '1px solid #e7e5e3',
            padding: '1.75rem 2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.6875rem', color: '#888', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
              ORDER IDENTIFIER
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 900 }}>
              {order.order_number}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '0.6875rem', color: '#888', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
              TRACKING NUMBER
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.9375rem', fontWeight: 700, color: '#b51224' }}>
              {order.tracking_number || 'PENDING DISPATCH'}
            </span>
          </div>

          <button
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}
          >
            <Printer size={14} />
            <span>PRINT RECEIPT</span>
          </button>
        </div>

        {/* Fulfillment Stepper */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            DISPATCH FULFILLMENT STATUS
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            {steps.map((step, idx) => (
              <div key={step.label} style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: step.done ? '#0a0a0a' : '#f0efed',
                    color: step.done ? '#ffffff' : '#999999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  {step.done ? <Check size={16} /> : idx + 1}
                </div>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>
                  {step.label}
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#888888' }}>{step.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown & Delivery Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid #e7e5e3',
          }}
        >
          {/* Order Items */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
              ACQUIRED GARMENTS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {order.items.map((item: OrderItem) => (
                <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={item.image_url || '/images/product-hoodie.jpg'}
                    alt={item.product_title}
                    style={{ width: '60px', height: '80px', objectFit: 'cover', backgroundColor: '#f7f6f4' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      {item.product_title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                      {item.variant_color} • {item.variant_size} • Qty: {item.quantity}
                    </p>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div style={{ borderTop: '1px solid #f0efed', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b51224' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                <span>Shipping ({order.shipping_method.toUpperCase()})</span>
                <span>{order.shipping === 0 ? 'COMPLIMENTARY' : formatPrice(order.shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b6b6b' }}>
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1rem', borderTop: '1px solid #0a0a0a', paddingTop: '0.5rem' }}>
                <span>TOTAL PAID</span>
                <span style={{ color: '#b51224' }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
              DELIVERY DESTINATION
            </h3>
            <div style={{ backgroundColor: '#faf9f8', padding: '1.5rem', border: '1px solid #e7e5e3', fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              <p style={{ fontWeight: 800, color: '#0a0a0a' }}>
                {order.first_name} {order.last_name}
              </p>
              <p>{order.address1}</p>
              {order.address2 && <p>{order.address2}</p>}
              <p>{order.city}, {order.state} {order.postal_code}</p>
              <p>{order.country}</p>
              <p style={{ marginTop: '0.5rem', color: '#6b6b6b' }}>Tel: {order.phone || 'N/A'}</p>
            </div>

            <button
              onClick={() => onNavigate('/collections')}
              className="btn-primary"
              style={{ width: '100%', padding: '1rem' }}
            >
              <span>RETURN TO GYMWEAR STOREFRONT</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
