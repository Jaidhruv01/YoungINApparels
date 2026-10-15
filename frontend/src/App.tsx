import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { WishlistProvider } from './context/WishlistContext';
import { AnnouncementTicker } from './components/layout/AnnouncementTicker';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/wishlist/WishlistDrawer';
import { SearchOverlay } from './components/search/SearchOverlay';

// Pages
import { Home } from './pages/Home';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetail } from './pages/ProductDetail';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PoliciesPage } from './pages/PoliciesPage';

const StorefrontApp: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const { toastMessage } = useCart();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOverlayOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine current view
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <Home onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/products/')) {
      const slug = currentPath.replace('/products/', '');
      return <ProductDetail slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/collections/')) {
      const slug = currentPath.replace('/collections/', '');
      return <CollectionPage collectionSlug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/collections') {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q') || undefined;
      return <CollectionPage searchQuery={q} onNavigate={navigate} />;
    }

    if (currentPath === '/lookbook') {
      return (
        <div>
          <CollectionPage collectionSlug="autumn-winter-26" onNavigate={navigate} />
        </div>
      );
    }

    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/order-confirmation/')) {
      const orderNumber = currentPath.replace('/order-confirmation/', '');
      return <OrderConfirmation orderNumber={orderNumber} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/admin')) {
      return <AdminPage onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    if (currentPath === '/faq') {
      return <FAQPage onNavigate={navigate} />;
    }

    if (currentPath === '/shipping-returns') {
      return <PoliciesPage type="shipping" onNavigate={navigate} />;
    }

    if (currentPath === '/size-guide') {
      return <PoliciesPage type="size-guide" onNavigate={navigate} />;
    }

    if (currentPath === '/privacy') {
      return <PoliciesPage type="privacy" onNavigate={navigate} />;
    }

    if (currentPath === '/terms') {
      return <PoliciesPage type="terms" onNavigate={navigate} />;
    }

    // Default Fallback
    return (
      <div className="container-custom" style={{ padding: '8rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
          404 — ARCHIVE NOT LOCATED
        </h2>
        <p style={{ color: '#6b6b6b', marginBottom: '2rem' }}>
          The requested atelier page does not exist or has been retired from the collection.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          RETURN TO ATELIER HOME
        </button>
      </div>
    );
  };

  const isCheckoutView = currentPath === '/checkout';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: !isCheckoutView ? '60px' : '0' }}>
      {/* Announcement Ticker */}
      {!isCheckoutView && <AnnouncementTicker />}

      {/* Main Header */}
      {!isCheckoutView && (
        <Header
          onOpenSearch={() => setSearchOverlayOpen(true)}
          currentPath={currentPath}
          onNavigate={navigate}
        />
      )}

      {/* Main Page Content */}
      <div style={{ flex: 1 }}>{renderRoute()}</div>

      {/* Footer */}
      {!isCheckoutView && <Footer onNavigate={navigate} />}

      {/* Slideout Cart Drawer */}
      <CartDrawer onNavigate={navigate} />

      {/* Slideout Wishlist Drawer */}
      <WishlistDrawer onNavigate={navigate} />

      {/* Live Search Overlay */}
      <SearchOverlay
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        onNavigate={navigate}
      />

      {/* Mobile Floating App Bottom Navigation */}
      <MobileBottomNav
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOverlayOpen(true)}
      />

      {/* Toast Feedback */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '2px',
            fontSize: '0.8125rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            zIndex: 99999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            borderLeft: '4px solid #b51224',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <WishlistProvider>
          <StorefrontApp />
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}
