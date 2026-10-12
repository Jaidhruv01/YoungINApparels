import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import {
  Shield, Package, ShoppingCart, Tag, Edit3, Check, RefreshCw,
  Plus, Eye
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'inventory' | 'promotions' | 'cms'>('dashboard');

  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [cmsSections, setCmsSections] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // New promo form state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoValue, setNewPromoValue] = useState(15);
  const [newPromoType, setNewPromoType] = useState('percentage');
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string | null>(null);

  // CMS edit state
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [cmsSaveMsg, setCmsSaveMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dash, ordList, prodList, discList, cmsData] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminOrders(),
        api.getProducts(),
        api.getAdminDiscounts(),
        api.getHomepageCMS(),
      ]);
      setMetrics(dash.metrics);
      setOrders(ordList);
      setProducts(prodList);
      setDiscounts(discList);
      setCmsSections(cmsData);

      if (cmsData['hero']) {
        setHeroTitle(cmsData['hero'].title || '');
        setHeroSubtitle(cmsData['hero'].subtitle || '');
      }
      if (cmsData['announcement']) {
        setAnnouncementText(cmsData['announcement'].title || '');
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    }
  };

  const handleUpdateStock = async (variantId: number, currentQty: number, delta: number) => {
    try {
      const newQty = Math.max(0, currentQty + delta);
      await api.updateVariantInventory(variantId, newQty);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;
    try {
      await api.createAdminDiscount({
        code: newPromoCode.toUpperCase().trim(),
        value: Number(newPromoValue),
        discount_type: newPromoType,
        minimum_order_value: 0,
        active: true,
      });
      setNewPromoCode('');
      setPromoSuccessMsg(`Promotional discount ${newPromoCode.toUpperCase()} published!`);
      setTimeout(() => setPromoSuccessMsg(null), 3500);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create promo code');
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateAdminCMS('hero', {
        title: heroTitle,
        subtitle: heroSubtitle,
      });
      await api.updateAdminCMS('announcement', {
        title: announcementText,
      });
      setCmsSaveMsg('Homepage content updated and live across storefront!');
      setTimeout(() => setCmsSaveMsg(null), 3500);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update CMS');
    }
  };

  return (
    <div style={{ backgroundColor: '#fcfbf9', minHeight: '90vh', paddingBottom: '6rem' }}>
      {/* Admin Top Navigation */}
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', borderBottom: '1px solid #222222' }}>
        <div className="container-custom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '65px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#b51224', color: '#fff', padding: '4px 8px', fontSize: '0.6875rem', fontWeight: 900 }}>
              ATELIER CONSOLE
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.14em' }}>
              YOUNGIN APPARELS CMS
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => onNavigate('/')}
              style={{
                background: 'none',
                border: '1px solid #333333',
                color: '#ffffff',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Eye size={14} />
              <span>LIVE STOREFRONT</span>
            </button>
            <button
              onClick={loadData}
              style={{
                background: 'none',
                border: 'none',
                color: '#888888',
                cursor: 'pointer',
                padding: '6px',
              }}
              title="Refresh console"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Sub-nav */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e3' }}>
        <div className="container-custom" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto' }}>
          {[
            { id: 'dashboard', label: 'METRICS DASHBOARD', icon: Shield },
            { id: 'orders', label: `CLIENT ORDERS (${orders.length})`, icon: ShoppingCart },
            { id: 'inventory', label: 'INVENTORY & VARIANTS', icon: Package },
            { id: 'promotions', label: 'DISCOUNTS & PROMOS', icon: Tag },
            { id: 'cms', label: 'HOMEPAGE CMS', icon: Edit3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '1rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: isActive ? '#b51224' : '#6b6b6b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderBottom: isActive ? '2px solid #b51224' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: '2.5rem' }}>
        {/* TAB 1: METRICS DASHBOARD */}
        {activeTab === 'dashboard' && metrics && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem',
              }}
            >
              <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid #e7e5e3' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  TOTAL ATELIER SALES
                </span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#0a0a0a', marginTop: '6px' }}>
                  {formatPrice(metrics.total_revenue)}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>● Fully reconciled</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid #e7e5e3' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  DISPATCHED ORDERS
                </span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#0a0a0a', marginTop: '6px' }}>
                  {metrics.total_orders}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>Lifetime customer volume</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid #e7e5e3' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ACTIVE ARCHIVE PIECES
                </span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#0a0a0a', marginTop: '6px' }}>
                  {metrics.total_products}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>Over 32 tailored variants</span>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid #e7e5e3' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  LOW INVENTORY WARNINGS
                </span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#b51224', marginTop: '6px' }}>
                  {metrics.low_stock_count}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#b51224', fontWeight: 700 }}>Attention recommended</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e3', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase' }}>RECENT ORDER ACTIVITY</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{ background: 'none', border: 'none', color: '#b51224', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  VIEW ALL ORDERS →
                </button>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e7e5e3', color: '#6b6b6b' }}>
                    <th style={{ padding: '0.75rem 0' }}>ORDER #</th>
                    <th style={{ padding: '0.75rem 0' }}>CLIENT</th>
                    <th style={{ padding: '0.75rem 0' }}>TOTAL</th>
                    <th style={{ padding: '0.75rem 0' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #f5f4f2' }}>
                      <td style={{ padding: '0.85rem 0', fontWeight: 800 }}>{o.order_number}</td>
                      <td style={{ padding: '0.85rem 0' }}>{o.first_name} {o.last_name}</td>
                      <td style={{ padding: '0.85rem 0', fontWeight: 800 }}>{formatPrice(o.total)}</td>
                      <td style={{ padding: '0.85rem 0' }}>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            backgroundColor: o.status === 'delivered' ? '#dcfce7' : o.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                            color: o.status === 'delivered' ? '#166534' : o.status === 'shipped' ? '#1e40af' : '#92400e',
                            textTransform: 'uppercase',
                          }}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e3', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              CUSTOMER ORDERS & LOGISTICS
            </h3>

            {orders.length === 0 ? (
              <p style={{ color: '#6b6b6b' }}>No customer orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      border: '1px solid #e7e5e3',
                      padding: '1.5rem',
                      backgroundColor: '#faf9f8',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
                          {ord.order_number}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6b6b6b', marginLeft: '12px' }}>
                          Placed by {ord.first_name} {ord.last_name} ({ord.email})
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 900 }}>
                          {formatPrice(ord.total)}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            border: '1px solid #0a0a0a',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                          }}
                        >
                          <option value="confirmed">CONFIRMED</option>
                          <option value="processing">PROCESSING</option>
                          <option value="shipped">SHIPPED</option>
                          <option value="delivered">DELIVERED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#555555', marginBottom: '1rem' }}>
                      Destination: {ord.address1}, {ord.city}, {ord.state} {ord.postal_code}, {ord.country} • Courier Tracking: <strong>{ord.tracking_number}</strong>
                    </div>

                    {/* Order items */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #e7e5e3', paddingTop: '1rem' }}>
                      {ord.items?.map((it: any) => (
                        <div key={it.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <img
                            src={it.image_url || '/images/product-hoodie.jpg'}
                            alt=""
                            style={{ width: '40px', height: '52px', objectFit: 'cover' }}
                          />
                          <div style={{ fontSize: '0.75rem' }}>
                            <strong>{it.product_title}</strong>
                            <div>{it.variant_color} • {it.variant_size} (Qty: {it.quantity})</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e3', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              VARIANT INVENTORY CONTROL
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {products.map((p) => (
                <div key={p.id} style={{ borderBottom: '1px solid #e7e5e3', paddingBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <img
                      src={p.cover_image}
                      alt=""
                      style={{ width: '50px', height: '65px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {p.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                        Category: {p.category} • Base Price: {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>

                  {/* Variants Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#faf9f8', color: '#6b6b6b' }}>
                        <th style={{ padding: '6px 12px', textAlign: 'left' }}>SKU</th>
                        <th style={{ padding: '6px 12px', textAlign: 'left' }}>COLOR</th>
                        <th style={{ padding: '6px 12px', textAlign: 'left' }}>SIZE</th>
                        <th style={{ padding: '6px 12px', textAlign: 'left' }}>STOCK ON HAND</th>
                        <th style={{ padding: '6px 12px', textAlign: 'right' }}>QUICK ADJUST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.variants?.map((v: any) => (
                        <tr key={v.id} style={{ borderTop: '1px solid #f0efed' }}>
                          <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>{v.sku}</td>
                          <td style={{ padding: '8px 12px' }}>{v.color}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 700 }}>{v.size}</td>
                          <td style={{ padding: '8px 12px' }}>
                            <span
                              style={{
                                color: v.available_quantity <= 3 ? '#b51224' : '#0a0a0a',
                                fontWeight: 800,
                              }}
                            >
                              {v.available_quantity} units
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '4px' }}>
                              <button
                                onClick={() => handleUpdateStock(v.id, v.available_quantity, -1)}
                                style={{
                                  border: '1px solid #ccc',
                                  background: '#fff',
                                  padding: '2px 8px',
                                  cursor: 'pointer',
                                  fontWeight: 800,
                                }}
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleUpdateStock(v.id, v.available_quantity, 5)}
                                style={{
                                  border: '1px solid #ccc',
                                  background: '#fff',
                                  padding: '2px 8px',
                                  cursor: 'pointer',
                                  fontWeight: 800,
                                }}
                              >
                                +5
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROMOTIONS */}
        {activeTab === 'promotions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {/* Create Promo */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e3', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                ISSUE PROMOTIONAL CODE
              </h3>
              <form onSubmit={handleCreatePromo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    PROMO CODE (UPPERCASE)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. RUNWAY20"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                    className="input-editorial"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    DISCOUNT TYPE
                  </label>
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value)}
                    className="input-editorial"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Currency Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    VALUE
                  </label>
                  <input
                    type="number"
                    required
                    value={newPromoValue}
                    onChange={(e) => setNewPromoValue(Number(e.target.value))}
                    className="input-editorial"
                  />
                </div>

                <button type="submit" className="btn-crimson" style={{ marginTop: '0.5rem' }}>
                  <Plus size={16} />
                  <span>PUBLISH DISCOUNT CODE</span>
                </button>

                {promoSuccessMsg && (
                  <p style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                    {promoSuccessMsg}
                  </p>
                )}
              </form>
            </div>

            {/* Existing Codes */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e3', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                ACTIVE DISCOUNT CODES
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {discounts.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      border: '1px solid #e7e5e3',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#faf9f8',
                    }}
                  >
                    <div>
                      <strong style={{ fontFamily: 'monospace', fontSize: '0.9375rem', color: '#b51224' }}>
                        {d.code}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                        {d.discount_type === 'percentage' ? `${d.value}% Off` : `₹${d.value.toLocaleString('en-IN')} Off`} • {d.usage_count} times used
                      </div>
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: d.active ? '#10b981' : '#999' }}>
                      {d.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HOMEPAGE CMS */}
        {activeTab === 'cms' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e7e5e3', padding: '2.5rem', maxWidth: '780px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              HOMEPAGE EDITORIAL CONTENT CMS
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', marginBottom: '2rem' }}>
              Edit live announcements, hero copy, and campaign text without touching code or redeploying.
            </p>

            <form onSubmit={handleSaveCMS} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  ANNOUNCEMENT TICKER BANNER TEXT
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="input-editorial"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  HERO HEADLINE
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="input-editorial"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  HERO SUBTITLE / COPY
                </label>
                <textarea
                  rows={3}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="input-editorial"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                <Check size={16} />
                <span>SAVE & PUBLISH TO LIVE STOREFRONT</span>
              </button>

              {cmsSaveMsg && (
                <p style={{ color: '#10b981', fontSize: '0.8125rem', fontWeight: 700 }}>
                  {cmsSaveMsg}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
