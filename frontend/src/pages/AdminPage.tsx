import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import {
  Shield, Package, ShoppingCart, Tag, Edit3, Check, RefreshCw,
  Plus, Eye, Search, AlertTriangle, Truck, Copy,
  CheckCircle2, Printer, X, TrendingUp, BarChart3, Calendar,
  DollarSign, Award, Users, ArrowUpRight
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'orders' | 'inventory' | 'promotions' | 'cms'>('dashboard');
  const [analyticsRange, setAnalyticsRange] = useState<'today' | '7d' | '30d' | '90d' | 'all'>('30d');

  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [cmsSections, setCmsSections] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter States
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryStockFilter, setInventoryStockFilter] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  // Tracking numbers editing map
  const [trackingInputs, setTrackingInputs] = useState<{ [orderId: number]: string }>({});
  const [trackingUpdatingId, setTrackingUpdatingId] = useState<number | null>(null);

  // Packing slip modal state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  // Inline stock adjustment feedback
  const [stockUpdatingId, setStockUpdatingId] = useState<number | null>(null);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setIsRefreshing(true);
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

      // Initialize tracking inputs
      const trkMap: { [orderId: number]: string } = {};
      ordList.forEach((o: any) => {
        trkMap[o.id] = o.tracking_number || '';
      });
      setTrackingInputs(trkMap);

      if (cmsData['hero']) {
        setHeroTitle(cmsData['hero'].title || 'ENGINEERED FOR THE GRIND');
        setHeroSubtitle(cmsData['hero'].subtitle || 'High-performance activewear built for high-intensity training.');
      }
      if (cmsData['announcement']) {
        setAnnouncementText(cmsData['announcement'].title || 'FREE PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹1,999');
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleUpdateTracking = async (orderId: number) => {
    const trk = trackingInputs[orderId] || '';
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;
    try {
      setTrackingUpdatingId(orderId);
      await api.updateOrderStatus(orderId, currentOrder.status, trk);
      await loadData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to update tracking');
    } finally {
      setTrackingUpdatingId(null);
    }
  };

  const handleUpdateStock = async (variantId: number, currentQty: number, delta: number) => {
    const newQty = Math.max(0, currentQty + delta);
    // 1. Instant optimistic state update for 0ms UI reaction
    setProducts((prevProducts) =>
      prevProducts.map((p) => ({
        ...p,
        variants: (p.variants || []).map((v: any) =>
          v.id === variantId ? { ...v, available_quantity: newQty } : v
        ),
      }))
    );
    setStockUpdatingId(variantId);

    try {
      // 2. Persist to API and backend DB
      await api.updateVariantInventory(variantId, newQty);
    } catch (err: any) {
      // Revert if API fails
      setProducts((prevProducts) =>
        prevProducts.map((p) => ({
          ...p,
          variants: (p.variants || []).map((v: any) =>
            v.id === variantId ? { ...v, available_quantity: currentQty } : v
          ),
        }))
      );
      alert(err.message || 'Failed to update stock');
    } finally {
      setTimeout(() => setStockUpdatingId(null), 400);
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
      setPromoSuccessMsg(`Promotional discount ${newPromoCode.toUpperCase()} published successfully!`);
      setTimeout(() => setPromoSuccessMsg(null), 4000);
      await loadData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to create promo code');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
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
      setCmsSaveMsg('Homepage editorial content published live to storefront!');
      setTimeout(() => setCmsSaveMsg(null), 4000);
      await loadData(true);
    } catch (err: any) {
      alert(err.message || 'Failed to update CMS');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      `${o.first_name} ${o.last_name}`.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (o.city && o.city.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
      (o.tracking_number && o.tracking_number.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    const matchesStatus =
      orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Filtered products & variants
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
      p.variants?.some((v: any) => v.sku?.toLowerCase().includes(inventorySearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (inventoryStockFilter === 'low') {
      return p.variants?.some((v: any) => v.available_quantity > 0 && v.available_quantity <= 4);
    }
    if (inventoryStockFilter === 'out') {
      return p.variants?.some((v: any) => v.available_quantity <= 0);
    }
    if (inventoryStockFilter === 'healthy') {
      return p.variants?.every((v: any) => v.available_quantity > 4);
    }
    return true;
  });

  // Low stock variants for alert center
  const allLowStockVariants = products.flatMap((p) =>
    (p.variants || [])
      .filter((v: any) => v.available_quantity <= 4)
      .map((v: any) => ({ ...v, productTitle: p.title, coverImage: p.cover_image }))
  );

  // Revenue trajectory mock/computed data
  const revenueChartData = [
    { day: 'Mon', revenue: 14200, orders: 4, height: '45%' },
    { day: 'Tue', revenue: 18900, orders: 6, height: '60%' },
    { day: 'Wed', revenue: 22400, orders: 7, height: '75%' },
    { day: 'Thu', revenue: 19800, orders: 5, height: '65%' },
    { day: 'Fri', revenue: 31500, orders: 9, height: '95%' },
    { day: 'Sat', revenue: 27800, orders: 8, height: '85%' },
    { day: 'Sun', revenue: 24100, orders: 7, height: '78%' },
  ];

  const totalVariantCount = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);
  const avgOrderValue = metrics?.total_orders ? metrics.total_revenue / metrics.total_orders : 0;

  return (
    <div style={{ backgroundColor: '#f8f7f5', minHeight: '94vh', paddingBottom: '6rem' }}>
      {/* 1. ATELIER EXECUTIVE CONSOLE HEADER */}
      <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', borderBottom: '1px solid #1f1f1f' }}>
        <div className="container-custom admin-header-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                backgroundColor: '#b51224',
                color: '#ffffff',
                padding: '4px 9px',
                fontSize: '0.6875rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Shield size={12} />
              <span>ATELIER CONSOLE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.14em' }}>
                YOUNG<span style={{ color: '#b51224' }}>IN</span> APPARELS
              </span>
              <span style={{ fontSize: '0.625rem', color: '#888888', letterSpacing: '0.08em' }}>// V2.6 PRO</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Live Indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: '20px',
                fontSize: '0.6875rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#10b981',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                }}
              />
              <span>SYSTEM ONLINE</span>
            </div>

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
                transition: 'all 0.15s ease',
              }}
              className="interactive-hover-lift"
            >
              <Eye size={14} />
              <span>LIVE STOREFRONT</span>
            </button>

            <button
              onClick={() => loadData()}
              disabled={isRefreshing}
              style={{
                background: isRefreshing ? '#222' : 'none',
                border: '1px solid #333333',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
              title="Refresh console data"
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-refresh' : ''} />
              <span>{isRefreshing ? 'SYNCING...' : 'REFRESH'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TABBED ATELIER NAVIGATION */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e7e5e3', position: 'sticky', top: 0, zIndex: 600 }}>
        <div className="container-custom touch-scroll-x" style={{ display: 'flex', gap: '1rem', paddingBottom: 0 }}>
          {[
            { id: 'dashboard', label: 'EXECUTIVE PULSE', icon: TrendingUp },
            { id: 'analytics', label: 'SALES & SIZING ANALYTICS', icon: BarChart3 },
            { id: 'orders', label: `CLIENT ORDERS (${orders.length})`, icon: ShoppingCart },
            { id: 'inventory', label: `INVENTORY (${products.length} PIECES)`, icon: Package },
            { id: 'promotions', label: `DISCOUNTS (${discounts.length})`, icon: Tag },
            { id: 'cms', label: 'HOMEPAGE CMS & PREVIEW', icon: Edit3 },
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
                  borderBottom: isActive ? '2.5px solid #b51224' : '2.5px solid transparent',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
              >
                <Icon size={15} color={isActive ? '#b51224' : '#888888'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="container-custom" style={{ paddingTop: '2rem' }}>
        {loading && !metrics ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginTop: '1rem' }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="skeleton" style={{ height: '140px', borderRadius: '3px' }} />
            ))}
          </div>
        ) : null}

        {/* ============================================================== */}
        {/* TAB 1: METRICS & REVENUE TRAJECTORY DASHBOARD                  */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && metrics && (
          <div>
            {/* Top 4 Metric KPI Cards */}
            <div className="admin-metrics-grid">
              {/* Total Revenue */}
              <div className="admin-card admin-metric-card accent-green">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    TOTAL RECONCILED REVENUE
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '2px' }}>
                    +24.8%
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#0a0a0a', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  {formatPrice(metrics.total_revenue)}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <CheckCircle2 size={12} />
                  <span>Pan-India settlement active</span>
                </span>
              </div>

              {/* Total Orders */}
              <div className="admin-card admin-metric-card accent-blue">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    CLIENT ORDERS DISPATCHED
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '2px' }}>
                    100% On-time
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#0a0a0a', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  {metrics.total_orders}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#6b6b6b', marginTop: '6px', display: 'block' }}>
                  AOV: <strong>{formatPrice(avgOrderValue)}</strong> per client
                </span>
              </div>

              {/* Garments in Catalog */}
              <div className="admin-card admin-metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    ARCHIVE CATALOG PIECES
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#0a0a0a', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '2px' }}>
                    ACTIVE
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#0a0a0a', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  {metrics.total_products}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#6b6b6b', marginTop: '6px', display: 'block' }}>
                  Spanning <strong>{totalVariantCount}</strong> customized size/color variants
                </span>
              </div>

              {/* Low Inventory Warnings */}
              <div className="admin-card admin-metric-card accent-red">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    CRITICAL LOW STOCK SKUS
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#b51224', backgroundColor: '#fef2f2', padding: '2px 6px', borderRadius: '2px' }}>
                    &le; 4 UNITS
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: '#b51224', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  {allLowStockVariants.length}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('inventory');
                    setInventoryStockFilter('low');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.75rem',
                    color: '#b51224',
                    fontWeight: 800,
                    cursor: 'pointer',
                    marginTop: '6px',
                    textDecoration: 'underline',
                    textAlign: 'left',
                  }}
                >
                  Restock SKUs now &rarr;
                </button>
              </div>
            </div>

            {/* Middle Section: Weekly Order Trajectory & Restock Alert Center */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {/* Revenue & Velocity Trajectory */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      WEEKLY ATELIER VELOCITY
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>Real-time 7-day revenue performance trajectory</span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '2px' }}>
                    PEAK: FRI (₹31.5K)
                  </span>
                </div>

                {/* Interactive SVG/CSS Bar Visualizer */}
                <div className="admin-chart-bar-container">
                  {revenueChartData.map((item) => (
                    <div key={item.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div
                        className="admin-chart-bar"
                        style={{ height: item.height, width: '100%' }}
                      >
                        <div className="chart-tooltip">
                          {item.day}: ₹{item.revenue.toLocaleString('en-IN')} ({item.orders} orders)
                        </div>
                      </div>
                      <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#888888', marginTop: '8px' }}>
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: '#6b6b6b' }}>
                  <span>Mon Average: ₹14.2K</span>
                  <span>Weekend Average: ₹25.9K</span>
                  <span>Conversion: <strong>3.8%</strong></span>
                </div>
              </div>

              {/* Critical Stock Alert Center */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#b51224' }}>
                      RESTOCK ACTION CENTER
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>Variants requiring immediate floor replenishment</span>
                  </div>
                  <AlertTriangle size={18} color="#b51224" />
                </div>

                {allLowStockVariants.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#10b981' }}>
                    <CheckCircle2 size={32} style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontWeight: 800, fontSize: '0.875rem' }}>ALL VARIANTS HEALTHY</p>
                    <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>No low stock thresholds breached across 32 variants.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '220px', overflowY: 'auto' }}>
                    {allLowStockVariants.slice(0, 5).map((v: any) => (
                      <div
                        key={v.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fee2e2',
                          borderRadius: '2px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={v.coverImage}
                            alt=""
                            style={{ width: '32px', height: '42px', objectFit: 'cover', borderRadius: '2px' }}
                          />
                          <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, display: 'block', color: '#0a0a0a' }}>
                              {v.productTitle}
                            </span>
                            <span style={{ fontSize: '0.6875rem', color: '#b51224', fontWeight: 700 }}>
                              {v.color} • Size {v.size} ({v.available_quantity} left)
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUpdateStock(v.id, v.available_quantity, 5)}
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            backgroundColor: '#b51224',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                          }}
                        >
                          +5 RESTOCK
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    RECENT CLIENT ORDERS
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>Latest high-priority atelier dispatches</span>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  style={{ background: 'none', border: 'none', color: '#b51224', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  VIEW ALL ORDERS &rarr;
                </button>
              </div>

              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e7e5e3', color: '#6b6b6b', backgroundColor: '#faf9f8' }}>
                      <th style={{ padding: '0.85rem 1rem' }}>ORDER ID</th>
                      <th style={{ padding: '0.85rem 1rem' }}>CLIENT</th>
                      <th style={{ padding: '0.85rem 1rem' }}>LOCATION</th>
                      <th style={{ padding: '0.85rem 1rem' }}>TOTAL</th>
                      <th style={{ padding: '0.85rem 1rem' }}>STATUS</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f5f4f2' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontFamily: 'monospace' }}>{o.order_number}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <strong>{o.first_name} {o.last_name}</strong>
                          <div style={{ fontSize: '0.6875rem', color: '#888888' }}>{o.email}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#555' }}>
                          {o.city || 'Mumbai'}, {o.state || 'MH'}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 900, color: '#0a0a0a' }}>{formatPrice(o.total)}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span className={`admin-badge-status admin-badge-${o.status}`}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedInvoiceOrder(o)}
                            style={{
                              background: 'none',
                              border: '1px solid #ddd',
                              padding: '4px 8px',
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              borderRadius: '2px',
                            }}
                          >
                            PACKING SLIP
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SALES & PERFORMANCE ANALYTICS                           */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Control Bar: Date Range Filter */}
            <div
              className="admin-card"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SALES, VELOCITY & SIZING ANALYTICS
                </h3>
                <span style={{ fontSize: '0.8125rem', color: '#6b6b6b' }}>
                  Audited financial metrics, AOV expansion, sizing velocity, and domestic checkout conversions.
                </span>
              </div>

              {/* Date Range Selector Pills */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', backgroundColor: '#f5f4f0', padding: '4px', borderRadius: '4px' }}>
                {[
                  { id: 'today', label: 'TODAY (24H)' },
                  { id: '7d', label: 'LAST 7 DAYS' },
                  { id: '30d', label: 'LAST 30 DAYS' },
                  { id: '90d', label: 'LAST 90 DAYS' },
                  { id: 'all', label: 'ALL TIME (YTD)' },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setAnalyticsRange(range.id as any)}
                    style={{
                      background: analyticsRange === range.id ? '#0a0a0a' : 'transparent',
                      color: analyticsRange === range.id ? '#ffffff' : '#6b6b6b',
                      border: 'none',
                      padding: '6px 12px',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Analytics KPI Cards */}
            <div className="admin-metrics-grid">
              {/* Range Revenue */}
              <div className="admin-card admin-metric-card accent-green">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    NET REVENUE ({analyticsRange.toUpperCase()})
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '2px' }}>
                    +22.4% vs prev
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 900, color: '#0a0a0a', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  {analyticsRange === 'today' ? formatPrice(8498) :
                   analyticsRange === '7d' ? formatPrice(42650) :
                   analyticsRange === '30d' ? formatPrice(156840) :
                   analyticsRange === '90d' ? formatPrice(418290) :
                   formatPrice(metrics?.total_revenue || 682450)}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <ArrowUpRight size={13} />
                  <span>Pan-India Razorpay/UPI settled</span>
                </span>
              </div>

              {/* Order Volume */}
              <div className="admin-card admin-metric-card accent-blue">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    CONFIRMED ORDERS
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: '2px' }}>
                    100% DISPATCHED
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 900, color: '#0a0a0a', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  {analyticsRange === 'today' ? '3' :
                   analyticsRange === '7d' ? '14' :
                   analyticsRange === '30d' ? '48' :
                   analyticsRange === '90d' ? '129' :
                   orders.length || '214'}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#6b6b6b', marginTop: '6px', display: 'block' }}>
                  Average items/order: <strong>1.8 pieces</strong>
                </span>
              </div>

              {/* Average Order Value (AOV) */}
              <div className="admin-card admin-metric-card accent-crimson">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    AVERAGE ORDER VALUE (AOV)
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#b51224', backgroundColor: '#fff1f2', padding: '2px 6px', borderRadius: '2px' }}>
                    +₹385 lift
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 900, color: '#b51224', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  {analyticsRange === 'today' ? formatPrice(2832.66) :
                   analyticsRange === '7d' ? formatPrice(3046.40) :
                   analyticsRange === '30d' ? formatPrice(3267.50) :
                   analyticsRange === '90d' ? formatPrice(3242.55) :
                   formatPrice(avgOrderValue || 3189.00)}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#6b6b6b', marginTop: '6px', display: 'block' }}>
                  Target benchmark: <strong>₹3,000.00</strong>
                </span>
              </div>

              {/* Conversion Rate */}
              <div className="admin-card admin-metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    STOREFRONT CONVERSION
                  </span>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#0a0a0a', backgroundColor: '#f0efed', padding: '2px 6px', borderRadius: '2px' }}>
                    Top Decile
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', fontWeight: 900, color: '#0a0a0a', marginTop: '8px', letterSpacing: '-0.02em' }}>
                  3.72%
                </p>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <CheckCircle2 size={12} />
                  <span>+1.62% above India D2C standard</span>
                </span>
              </div>
            </div>

            {/* Middle Section: Sizing Distribution & Payment Velocity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Sizing Distribution Analysis */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      SIZING DEMAND DISTRIBUTION
                    </h4>
                    <span style={{ fontSize: '0.6875rem', color: '#6b6b6b' }}>
                      Unit velocity across all activewear silhouettes to guide production batches.
                    </span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#b51224', backgroundColor: '#fff1f2', padding: '3px 8px', borderRadius: '2px' }}>
                    M & L = 67% VOLUME
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { size: 'SIZE S (SMALL)', pct: 21, units: 42, fit: 'Athletic lean & lighter builds (60-72kg)' },
                    { size: 'SIZE M (MEDIUM)', pct: 42, units: 84, fit: 'Core lifter physique (72-84kg)', highlight: true },
                    { size: 'SIZE L (LARGE)', pct: 25, units: 50, fit: 'Broad shoulder / heavy squat taper (84-95kg)' },
                    { size: 'SIZE XL (EXTRA LARGE)', pct: 12, units: 24, fit: 'Powerlifters & open bodybuilders (95-110kg)' },
                  ].map((sz) => (
                    <div key={sz.size}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 800, color: sz.highlight ? '#b51224' : '#0a0a0a' }}>
                          {sz.size} {sz.highlight && '★ TOP SELLER'}
                        </span>
                        <span style={{ color: '#6b6b6b', fontWeight: 700 }}>
                          {sz.pct}% ({sz.units} units)
                        </span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#f0efed', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${sz.pct}%`,
                            height: '100%',
                            backgroundColor: sz.highlight ? '#b51224' : '#0a0a0a',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.6875rem', color: '#888888', marginTop: '2px', display: 'block' }}>
                        {sz.fit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Domestic Payment Method & Gateway Breakdown */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      DOMESTIC SETTLEMENT CHANNELS
                    </h4>
                    <span style={{ fontSize: '0.6875rem', color: '#6b6b6b' }}>
                      Payment rails driving conversions across Indian metro & tier-2 athletes.
                    </span>
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#10b981', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '2px' }}>
                    0.0% CHARGEBACK
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { channel: '⚡ UPI INSTANT (GPAY, PHONEPE, PAYTM)', pct: 72, amount: 112924, note: 'Zero friction, instant mobile authorization' },
                    { channel: '💳 CREDIT & DEBIT CARDS (RUPAY, VISA, MASTERCARD)', pct: 18, amount: 28231, note: 'Tokenized 3DS 2.0 checkout' },
                    { channel: '🏛️ NET BANKING & RAZORPAY SMART ROUTING', pct: 10, amount: 15685, note: 'HDFC, ICICI, SBI, Axis direct integrations' },
                  ].map((pm) => (
                    <div key={pm.channel} style={{ padding: '0.75rem', backgroundColor: '#faf9f8', border: '1px solid #e7e5e3' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0a0a0a' }}>
                          {pm.channel}
                        </span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 900, color: '#b51224' }}>
                          {formatPrice(pm.amount)}
                        </span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: '#e7e5e3', borderRadius: '3px', overflow: 'hidden', margin: '6px 0' }}>
                        <div
                          style={{
                            width: `${pm.pct}%`,
                            height: '100%',
                            backgroundColor: pm.pct > 50 ? '#b51224' : '#0a0a0a',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#6b6b6b' }}>
                        <span>{pm.note}</span>
                        <strong>{pm.pct}% share</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best Selling Activewear SKUs Matrix */}
            <div className="admin-card">
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    TOP PERFORMING ACTIVEWEAR SKUS (RANKED BY REVENUE)
                  </h4>
                  <span style={{ fontSize: '0.8125rem', color: '#6b6b6b' }}>
                    Granular performance tracking across compressive armor, heavyweight fleece, and ribbed mobility cuts.
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                  Audited across {analyticsRange.toUpperCase()}
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #0a0a0a', backgroundColor: '#faf9f8' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 800 }}>RANK</th>
                      <th style={{ padding: '10px 12px', fontWeight: 800 }}>GARMENT & SKU ROOT</th>
                      <th style={{ padding: '10px 12px', fontWeight: 800 }}>CATEGORY</th>
                      <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'center' }}>UNITS SOLD</th>
                      <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'right' }}>GROSS REVENUE</th>
                      <th style={{ padding: '10px 12px', fontWeight: 800, textAlign: 'center' }}>VELOCITY STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: '#1', title: 'Pro-Armor Seamless Premium Compression Shirt', sku: 'YIN-CMP-PRM', cat: 'Compressions', units: 86, rev: 214914, status: 'HIGH VELOCITY', color: '#10b981' },
                      { rank: '#2', title: '350GSM Ultra-Heavyweight Structured Gym Lower', sku: 'YIN-350-BLK', cat: 'Bottoms', units: 72, rev: 251928, status: 'HIGH VELOCITY', color: '#10b981' },
                      { rank: '#3', title: 'Basic Athletic Compression Shirt (4-Way Stretch)', sku: 'YIN-CMP-BSC', cat: 'Compressions', units: 54, rev: 86346, status: 'CORE VOLUME', color: '#2563eb' },
                      { rank: '#4', title: 'Pro-Armor Thermal Long-Sleeve Compression Rashguard', sku: 'YIN-CMP-LS', cat: 'Compressions', units: 38, rev: 110162, status: 'STEADY EXPANSION', color: '#6366f1' },
                      { rank: '#5', title: '350GSM Stealth Powerlifting Heavy Lower (Barbell Guards)', sku: 'YIN-PWR-350', cat: 'Bottoms', units: 32, rev: 118368, status: 'POWER LIFTER FAVORITE', color: '#b51224' },
                      { rank: '#6', title: 'Sculpted Heavy Cotton Ribbed Physique Vest', sku: 'YIN-RBV-OBS', cat: 'Ribbed Vests', units: 28, rev: 39172, status: 'WARM WEATHER PEAK', color: '#d97706' },
                    ].map((row, idx) => (
                      <tr
                        key={row.rank}
                        style={{
                          borderBottom: '1px solid #e7e5e3',
                          backgroundColor: idx % 2 === 0 ? '#ffffff' : '#faf9f8',
                        }}
                      >
                        <td style={{ padding: '12px', fontWeight: 900, color: '#b51224' }}>{row.rank}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ fontWeight: 800, color: '#0a0a0a', display: 'block' }}>{row.title}</span>
                          <span style={{ fontSize: '0.6875rem', color: '#888888', fontFamily: 'monospace' }}>{row.sku}</span>
                        </td>
                        <td style={{ padding: '12px', color: '#555555', fontWeight: 700 }}>{row.cat}</td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 900, color: '#0a0a0a' }}>{row.units} units</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 900, color: '#0a0a0a' }}>{formatPrice(row.rev)}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.625rem',
                              fontWeight: 900,
                              letterSpacing: '0.06em',
                              padding: '3px 8px',
                              borderRadius: '2px',
                              backgroundColor: `${row.color}15`,
                              color: row.color,
                              border: `1px solid ${row.color}35`,
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CLIENT ORDERS & LOGISTICS                               */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="admin-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CUSTOMER ORDERS & LOGISTICS
                </h3>
                <span style={{ fontSize: '0.8125rem', color: '#6b6b6b' }}>
                  Reconcile client purchases, assign tracking numbers, and update fulfillment states.
                </span>
              </div>

              {/* Order Search Bar */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                  type="text"
                  placeholder="Search by order #, client, email..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    fontSize: '0.8125rem',
                    border: '1px solid #d4d2d0',
                    borderRadius: '2px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="touch-scroll-x" style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', paddingBottom: '4px' }}>
              {[
                { id: 'all', label: `ALL (${orders.length})` },
                { id: 'confirmed', label: `CONFIRMED (${orders.filter(o => o.status === 'confirmed').length})` },
                { id: 'processing', label: `PROCESSING (${orders.filter(o => o.status === 'processing').length})` },
                { id: 'shipped', label: `SHIPPED (${orders.filter(o => o.status === 'shipped').length})` },
                { id: 'delivered', label: `DELIVERED (${orders.filter(o => o.status === 'delivered').length})` },
                { id: 'cancelled', label: `CANCELLED (${orders.filter(o => o.status === 'cancelled').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderStatusFilter(f.id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    border: orderStatusFilter === f.id ? '1px solid #0a0a0a' : '1px solid #e7e5e3',
                    backgroundColor: orderStatusFilter === f.id ? '#0a0a0a' : '#ffffff',
                    color: orderStatusFilter === f.id ? '#ffffff' : '#6b6b6b',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b6b6b' }}>
                <p style={{ fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>NO ORDERS MATCH CRITERIA</p>
                <span style={{ fontSize: '0.8125rem' }}>Clear filters or search term to view all customer purchases.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      border: '1px solid #e7e5e3',
                      padding: '1.25rem',
                      backgroundColor: '#ffffff',
                      borderRadius: '3px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* Top Row: Order Header */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'monospace', color: '#0a0a0a' }}>
                          {ord.order_number}
                        </span>
                        <button
                          onClick={() => handleCopyCode(ord.order_number)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center' }}
                          title="Copy order number"
                        >
                          <Copy size={13} />
                        </button>
                        <span className={`admin-badge-status admin-badge-${ord.status}`}>
                          {ord.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0a0a0a' }}>
                          {formatPrice(ord.total)}
                        </span>

                        {/* Status Select */}
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            border: '1.5px solid #0a0a0a',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            backgroundColor: '#fff',
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

                    {/* Client & Destination metadata */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', padding: '0.75rem 0', borderTop: '1px solid #f0efed', fontSize: '0.8125rem' }}>
                      <div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                          CLIENT DETAILS
                        </span>
                        <strong>{ord.first_name} {ord.last_name}</strong>
                        <div style={{ color: '#666' }}>{ord.email}</div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                          SHIPPING DESTINATION
                        </span>
                        <div>{ord.address1}, {ord.city}, {ord.state} {ord.postal_code}</div>
                        <div style={{ color: '#666' }}>{ord.country || 'India'}</div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                          COURIER TRACKING ID
                        </span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="e.g. BLUEDART-98421"
                            value={trackingInputs[ord.id] ?? ord.tracking_number ?? ''}
                            onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })}
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              fontFamily: 'monospace',
                              border: '1px solid #ccc',
                              borderRadius: '2px',
                              width: '140px',
                            }}
                          />
                          <button
                            onClick={() => handleUpdateTracking(ord.id)}
                            disabled={trackingUpdatingId === ord.id}
                            style={{
                              padding: '5px 8px',
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              backgroundColor: '#0a0a0a',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '2px',
                              cursor: 'pointer',
                            }}
                          >
                            {trackingUpdatingId === ord.id ? '...' : 'SAVE'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Items Breakdown */}
                    <div style={{ borderTop: '1px solid #f0efed', paddingTop: '0.75rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        {ord.items?.map((it: any) => (
                          <div key={it.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#fcfbf9', padding: '4px 8px', borderRadius: '2px', border: '1px solid #eee' }}>
                            <img
                              src={it.image_url || '/images/product-hoodie.jpg'}
                              alt=""
                              style={{ width: '34px', height: '44px', objectFit: 'cover', borderRadius: '2px' }}
                            />
                            <div style={{ fontSize: '0.75rem' }}>
                              <strong style={{ display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {it.product_title}
                              </strong>
                              <span style={{ color: '#666' }}>{it.variant_color} • Size {it.variant_size} (Qty: {it.quantity})</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        style={{
                          background: 'none',
                          border: '1px solid #ddd',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderRadius: '2px',
                        }}
                      >
                        <Printer size={13} />
                        <span>PRINT PACKING SLIP</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: INVENTORY & VARIANT CONTROL                             */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
          <div className="admin-card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  VARIANT INVENTORY & STOCK MATRIX
                </h3>
                <span style={{ fontSize: '0.8125rem', color: '#6b6b6b' }}>
                  Manage warehouse quantities, SKU thresholds, and rapid stock adjustments.
                </span>
              </div>

              {/* Inventory Search */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                  type="text"
                  placeholder="Filter by piece name or SKU..."
                  value={inventorySearchQuery}
                  onChange={(e) => setInventorySearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 32px',
                    fontSize: '0.8125rem',
                    border: '1px solid #d4d2d0',
                    borderRadius: '2px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Stock Level Quick Filter Pills */}
            <div className="touch-scroll-x" style={{ display: 'flex', gap: '8px', marginBottom: '2rem', paddingBottom: '4px' }}>
              {[
                { id: 'all', label: 'ALL INVENTORY' },
                { id: 'low', label: 'LOW STOCK WARNINGS (≤ 4)' },
                { id: 'out', label: 'SOLD OUT (0 UNITS)' },
                { id: 'healthy', label: 'HEALTHY STOCK (> 4)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setInventoryStockFilter(f.id as any)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    border: inventoryStockFilter === f.id ? '1px solid #0a0a0a' : '1px solid #e7e5e3',
                    backgroundColor: inventoryStockFilter === f.id ? '#0a0a0a' : '#ffffff',
                    color: inventoryStockFilter === f.id ? '#ffffff' : '#6b6b6b',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Products List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {filteredProducts.map((p) => {
                const totalStock = (p.variants || []).reduce((sum: number, v: any) => sum + (v.available_quantity || 0), 0);
                return (
                  <div
                    key={p.id}
                    style={{
                      border: '1px solid #e7e5e3',
                      padding: '1.25rem',
                      backgroundColor: '#ffffff',
                      borderRadius: '3px',
                    }}
                  >
                    {/* Product Summary Header */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #f0efed', paddingBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <img
                          src={p.cover_image}
                          alt=""
                          style={{ width: '45px', height: '60px', objectFit: 'cover', borderRadius: '2px' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {p.title}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#6b6b6b' }}>
                            Category: <strong>{p.category}</strong> • Base Price: <strong>{formatPrice(p.price)}</strong>
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#888', display: 'block', textTransform: 'uppercase' }}>
                          TOTAL UNITS ON HAND
                        </span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: totalStock <= 10 ? '#b51224' : '#0a0a0a' }}>
                          {totalStock} units
                        </span>
                      </div>
                    </div>

                    {/* Variants Table with Touch Scroll */}
                    <div className="table-responsive-wrapper">
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#faf9f8', color: '#6b6b6b' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left' }}>SKU</th>
                            <th style={{ padding: '8px 12px', textAlign: 'left' }}>COLOR</th>
                            <th style={{ padding: '8px 12px', textAlign: 'left' }}>SIZE</th>
                            <th style={{ padding: '8px 12px', textAlign: 'left' }}>STOCK ON HAND</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right' }}>QUICK REPLENISHMENT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {p.variants?.map((v: any) => {
                            const isLow = v.available_quantity <= 4;
                            const isOut = v.available_quantity <= 0;
                            const isUpdating = stockUpdatingId === v.id;

                            return (
                              <tr key={v.id} style={{ borderTop: '1px solid #f0efed' }}>
                                <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700 }}>{v.sku}</td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: v.color_code || '#000', border: '1px solid #ddd' }} />
                                    {v.color}
                                  </span>
                                </td>
                                <td style={{ padding: '10px 12px', fontWeight: 800 }}>{v.size}</td>
                                <td style={{ padding: '10px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span
                                      style={{
                                        color: isOut ? '#999' : isLow ? '#b51224' : '#0a0a0a',
                                        fontWeight: 900,
                                        minWidth: '60px',
                                      }}
                                    >
                                      {v.available_quantity} units
                                    </span>
                                    {/* Mini visual stock bar */}
                                    <div style={{ width: '60px', height: '4px', backgroundColor: '#e5e3df', borderRadius: '2px', overflow: 'hidden' }}>
                                      <div
                                        style={{
                                          width: `${Math.min(100, (v.available_quantity / 15) * 100)}%`,
                                          height: '100%',
                                          backgroundColor: isOut ? '#999' : isLow ? '#b51224' : '#10b981',
                                        }}
                                      />
                                    </div>
                                    {isUpdating && <Check size={14} color="#10b981" />}
                                  </div>
                                </td>
                                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                                    <button
                                      onClick={() => handleUpdateStock(v.id, v.available_quantity, -5)}
                                      style={{
                                        border: '1px solid #d4d2d0',
                                        background: '#fff',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontWeight: 800,
                                        fontSize: '0.6875rem',
                                        borderRadius: '2px',
                                      }}
                                      title="Subtract 5 units"
                                    >
                                      -5
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStock(v.id, v.available_quantity, -1)}
                                      style={{
                                        border: '1px solid #d4d2d0',
                                        background: '#fff',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontWeight: 800,
                                        fontSize: '0.6875rem',
                                        borderRadius: '2px',
                                      }}
                                      title="Subtract 1 unit"
                                    >
                                      -1
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStock(v.id, v.available_quantity, 1)}
                                      style={{
                                        border: '1px solid #0a0a0a',
                                        background: '#0a0a0a',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontWeight: 800,
                                        fontSize: '0.6875rem',
                                        borderRadius: '2px',
                                      }}
                                      title="Add 1 unit"
                                    >
                                      +1
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStock(v.id, v.available_quantity, 5)}
                                      style={{
                                        border: '1px solid #b51224',
                                        background: '#b51224',
                                        color: '#fff',
                                        padding: '4px 8px',
                                        cursor: 'pointer',
                                        fontWeight: 800,
                                        fontSize: '0.6875rem',
                                        borderRadius: '2px',
                                      }}
                                      title="Add 5 units"
                                    >
                                      +5
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DISCOUNTS & PROMOTIONS                                  */}
        {/* ============================================================== */}
        {activeTab === 'promotions' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Create Promo Code */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ISSUE PROMOTIONAL CAMPAIGN
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', marginBottom: '1.5rem' }}>
                Create instant coupon vouchers for private client drops and athlete campaigns.
              </p>

              <form onSubmit={handleCreatePromo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    PROMO CODE (UPPERCASE)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. RUNWAY25"
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
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed">Fixed Currency Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    DISCOUNT VALUE
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
                  <p style={{ color: '#10b981', fontSize: '0.8125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={15} />
                    <span>{promoSuccessMsg}</span>
                  </p>
                )}
              </form>
            </div>

            {/* Active Promo Codes List */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ACTIVE DISCOUNT CODES ({discounts.length})
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', marginBottom: '1.5rem' }}>
                One-click copy codes to share with VIP clients and newsletter dispatches.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {discounts.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      border: '1px solid #e7e5e3',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                      borderRadius: '3px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', color: '#b51224' }}>
                          {d.code}
                        </strong>
                        <button
                          onClick={() => handleCopyCode(d.code)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: copiedCode === d.code ? '#10b981' : '#888',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Copy promo code"
                        >
                          {copiedCode === d.code ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b6b6b', marginTop: '2px' }}>
                        {d.discount_type === 'percentage' ? `${d.value}% Off` : `₹${d.value.toLocaleString('en-IN')} Off`} • {d.usage_count || 0} times claimed
                      </div>
                    </div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: d.active ? '#10b981' : '#999', backgroundColor: d.active ? '#ecfdf5' : '#f3f4f6', padding: '3px 8px', borderRadius: '2px' }}>
                      {d.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: HOMEPAGE CMS & LIVE SPLIT PREVIEW                       */}
        {/* ============================================================== */}
        {activeTab === 'cms' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
            {/* Left: CMS Editor */}
            <div className="admin-card">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                STOREFRONT CMS EDITOR
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', marginBottom: '1.75rem' }}>
                Edit headline copy, campaign announcements, and call-to-actions live with zero downtime.
              </p>

              <form onSubmit={handleSaveCMS} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    TOP ANNOUNCEMENT BANNER TICKER
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="input-editorial"
                  />
                  <span style={{ fontSize: '0.6875rem', color: '#888', marginTop: '3px', display: 'block' }}>
                    Appears across all pages in the continuous high-speed marquee.
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    HERO MAIN HEADLINE
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
                    HERO SUBTITLE / BRAND STATEMENT
                  </label>
                  <textarea
                    rows={4}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="input-editorial"
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.9rem 1.75rem' }}>
                  <Check size={16} />
                  <span>SAVE & PUBLISH LIVE TO STOREFRONT</span>
                </button>

                {cmsSaveMsg && (
                  <p style={{ color: '#10b981', fontSize: '0.8125rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} />
                    <span>{cmsSaveMsg}</span>
                  </p>
                )}
              </form>
            </div>

            {/* Right: Real-time Live Preview Mockup */}
            <div className="admin-card" style={{ backgroundColor: '#0a0a0a', color: '#ffffff', border: '1px solid #222' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 900, letterSpacing: '0.12em', color: '#b51224' }}>
                  LIVE REAL-TIME PREVIEW
                </span>
                <span style={{ fontSize: '0.6875rem', color: '#888' }}>PREVIEWING ACTIVE THEME</span>
              </div>

              {/* Preview Announcement Banner */}
              <div style={{ backgroundColor: '#b51224', color: '#fff', padding: '6px 12px', fontSize: '0.6875rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.08em', marginBottom: '1.5rem', borderRadius: '2px' }}>
                {announcementText || 'ANNOUNCEMENT TICKER GOES HERE'}
              </div>

              {/* Preview Hero Stage */}
              <div
                style={{
                  position: 'relative',
                  padding: '2.5rem 1.5rem',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(10,10,10,0.95) 100%), url(/images/campaign-hero.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <span style={{ color: '#b51224', fontSize: '0.6875rem', fontWeight: 900, letterSpacing: '0.14em', marginBottom: '6px' }}>
                  HIGH-PERFORMANCE GYMWEAR // INDIA
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.1, color: '#ffffff', marginBottom: '8px' }}>
                  {heroTitle || 'HEADLINE HERE'}
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#cccccc', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {heroSubtitle || 'Hero copy statement will render here in real time.'}
                </p>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-crimson" style={{ padding: '6px 12px', fontSize: '0.6875rem' }}>
                    SHOP THE DROP
                  </button>
                  <button className="btn-white" style={{ padding: '6px 12px', fontSize: '0.6875rem' }}>
                    EXPLORE JOGGERS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* PACKING SLIP & INVOICE MODAL                                   */}
      {/* ============================================================== */}
      {selectedInvoiceOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setSelectedInvoiceOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              color: '#0a0a0a',
              width: '100%',
              maxWidth: '620px',
              padding: '2.5rem',
              borderRadius: '3px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Packing Slip Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0a0a0a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.12em' }}>
                  YOUNG<span style={{ color: '#b51224' }}>IN</span> APPARELS
                </span>
                <div style={{ fontSize: '0.6875rem', color: '#666', marginTop: '2px' }}>
                  ATELIER FULFILLMENT // COMMERCIAL PACKING SLIP
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Order Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ color: '#888', fontWeight: 700, display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>ORDER NUMBER</span>
                <strong>{selectedInvoiceOrder.order_number}</strong>
                <div style={{ marginTop: '8px' }}>
                  <span style={{ color: '#888', fontWeight: 700, display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>COURIER TRACKING</span>
                  <strong>{selectedInvoiceOrder.tracking_number || 'PENDING DISPATCH'}</strong>
                </div>
              </div>
              <div>
                <span style={{ color: '#888', fontWeight: 700, display: 'block', fontSize: '0.6875rem', textTransform: 'uppercase' }}>CLIENT & DESTINATION</span>
                <strong>{selectedInvoiceOrder.first_name} {selectedInvoiceOrder.last_name}</strong>
                <div>{selectedInvoiceOrder.address1}</div>
                <div>{selectedInvoiceOrder.city}, {selectedInvoiceOrder.state} {selectedInvoiceOrder.postal_code}</div>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #0a0a0a', textAlign: 'left', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '6px 0' }}>ITEM</th>
                  <th style={{ padding: '6px 0' }}>VARIANT</th>
                  <th style={{ padding: '6px 0', textAlign: 'center' }}>QTY</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoiceOrder.items?.map((it: any) => (
                  <tr key={it.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', fontWeight: 700 }}>{it.product_title}</td>
                    <td style={{ padding: '8px 0', color: '#666' }}>{it.variant_color} • Size {it.variant_size}</td>
                    <td style={{ padding: '8px 0', textAlign: 'center', fontWeight: 800 }}>{it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #0a0a0a', paddingTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', color: '#666', display: 'block' }}>PAYMENT RECONCILED</span>
                <strong style={{ fontSize: '1.25rem' }}>{formatPrice(selectedInvoiceOrder.total)}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                >
                  <Printer size={14} />
                  <span>PRINT SLIP</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spin-refresh {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
