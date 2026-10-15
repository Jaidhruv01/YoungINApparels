import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Globe, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';

interface HeaderProps {
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, currentPath, onNavigate }) => {
  const { cart, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const { currency, currencySymbol } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'COLLECTIONS', path: '/collections', tag: 'ALL' },
    { label: 'OUTERWEAR', path: '/collections/outerwear', tag: '850GSM' },
    { label: 'FLEECE', path: '/collections/fleece-hoodies', tag: '500GSM' },
    { label: 'DENIM', path: '/collections/denim', tag: '14OZ' },
    { label: 'LOOKBOOK', path: '/lookbook', tag: 'CAMPAIGN' },
    { label: 'ATELIER', path: '/about', tag: 'STORY' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-custom header-inner">
          {/* Left: Mobile Toggle & Desktop Nav */}
          <div className="header-left">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-toggle"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <nav className="desktop-nav">
              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive ? '#b51224' : '#0a0a0a',
                      position: 'relative',
                      padding: '4px 0',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: '#b51224',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center: Brand Wordmark */}
          <div className="header-center">
            <button
              onClick={() => handleNav('/')}
              className="brand-button"
              aria-label="YoungINApparels Home"
            >
              <span className="brand-wordmark">
                YOUNGIN<span style={{ color: '#b51224' }}>APPARELS</span>
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="header-right">
            {/* Currency Selector (Desktop only) */}
            <div className="currency-selector">
              <Globe size={14} color="#6b6b6b" />
              <span className="currency-label">INR (₹)</span>
            </div>

            {/* Wishlist Button (Desktop & Tablet) */}
            <button
              onClick={openWishlist}
              className="header-action-btn wishlist-header-btn"
              title="View saved items"
              aria-label="View saved items"
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span className="cart-badge">{wishlistCount}</span>
              )}
            </button>

            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="header-action-btn search-btn"
              title="Search collection (⌘K)"
              aria-label="Search collection"
            >
              <Search size={20} />
              <span className="desktop-search-label">SEARCH</span>
            </button>

            {/* Admin Console Link (Desktop only) */}
            <button
              onClick={() => handleNav('/admin')}
              className={`header-action-btn admin-btn ${currentPath.startsWith('/admin') ? 'active' : ''}`}
              title="Admin Portal"
            >
              <Shield size={12} />
              <span className="desktop-admin-label">ADMIN</span>
            </button>

            {/* Bag / Cart Button */}
            <button
              onClick={openCart}
              className="header-action-btn bag-btn"
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={21} />
              {cart && cart.item_count > 0 && (
                <span className="cart-badge">{cart.item_count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`drawer-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
          opacity: mobileMenuOpen ? 1 : 0,
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s ease, visibility 0.28s',
        }}
      />

      {/* Mobile Menu Drawer */}
      <div
        className="mobile-drawer-panel"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '85%',
          maxWidth: '350px',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          zIndex: 1001,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.32s',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          overflowX: 'hidden',
          overflowY: 'auto',
          boxShadow: mobileMenuOpen ? '10px 0 40px rgba(0,0,0,0.6)' : 'none',
        }}
      >
        {/* Drawer Brand Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '0.875rem',
            borderBottom: '1px solid #1f1f1f',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              whiteSpace: 'nowrap',
            }}
          >
            YOUNGIN<span style={{ color: '#b51224' }}>APPARELS</span>
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Quick Search inside Drawer */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: '#161616',
              border: '1px solid #282828',
              borderRadius: '2px',
              color: '#888888',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              letterSpacing: '0.04em',
            }}
          >
            <Search size={15} color="#b51224" />
            <span>SEARCH ARCHIVE PIECES (⌘K)...</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: isActive ? '#b51224' : '#ffffff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'color 0.15s ease',
                }}
              >
                <span>{link.label}</span>
                {link.tag && (
                  <span
                    style={{
                      fontSize: '0.5625rem',
                      padding: '2px 6px',
                      backgroundColor: '#181818',
                      color: '#888888',
                      borderRadius: '2px',
                      fontFamily: 'var(--font-body)',
                      letterSpacing: '0.08em',
                      fontWeight: 700,
                    }}
                  >
                    {link.tag}
                  </span>
                )}
              </button>
            );
          })}

          {/* Saved Wishlist Drawer Link */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openWishlist();
            }}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={16} color="#b51224" fill={wishlistCount > 0 ? '#b51224' : 'none'} />
              <span>SAVED WISHLIST</span>
            </span>
            {wishlistCount > 0 && (
              <span
                style={{
                  fontSize: '0.625rem',
                  padding: '2px 8px',
                  backgroundColor: '#b51224',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontWeight: 800,
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard */}
          <button
            onClick={() => handleNav('/admin')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              color: '#b51224',
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              padding: '6px 0',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Shield size={14} />
            <span>ADMIN DASHBOARD →</span>
          </button>
        </nav>

        {/* Concierge & Location Card in Drawer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #222222', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#999999' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#ffffff' }}>
              <Globe size={13} color="#b51224" />
              <span>INDIA (₹ INR)</span>
            </span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>FREE SHIPPING OVER ₹5,000</span>
          </div>

          <div
            style={{
              backgroundColor: '#141414',
              border: '1px solid #222222',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleNav('/contact')}
          >
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
                ATELIER CONCIERGE
              </p>
              <p style={{ fontSize: '0.625rem', color: '#888888', marginTop: '2px' }}>
                Direct Stylist Support & Sizing Assistance
              </p>
            </div>
            <span style={{ color: '#b51224', fontSize: '0.875rem', fontWeight: 800 }}>→</span>
          </div>

          <p style={{ fontSize: '0.625rem', color: '#666666', marginTop: '0.25rem' }}>
            Autumn / Winter Archive 2026 • International D2C Flagship
          </p>
        </div>
      </div>

      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 900;
          background-color: #ffffff;
          border-bottom: 1px solid #f0efed;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
          width: 100%;
        }
        .site-header.scrolled {
          border-bottom-color: #e7e5e3;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .header-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 60px;
          width: 100%;
        }
        .header-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 0;
        }
        .header-center {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-width: 0;
        }
        .header-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          min-width: 0;
        }
        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          margin-left: -8px;
          color: #0a0a0a;
        }
        .desktop-nav {
          display: none;
        }
        .brand-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .brand-wordmark {
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 900;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: #0a0a0a;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
        }
        .currency-selector {
          display: none;
        }
        .desktop-search-label, .desktop-admin-label {
          display: none;
        }
        .admin-btn {
          display: none;
        }
        .wishlist-header-btn {
          display: none;
        }
        .header-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          color: #0a0a0a;
          position: relative;
          border-radius: 2px;
          transition: opacity 0.2s ease, background-color 0.2s ease;
        }
        .header-action-btn:hover {
          opacity: 0.75;
        }
        .cart-badge {
          position: absolute;
          top: 0px;
          right: 0px;
          background-color: #b51224;
          color: #ffffff;
          font-size: 0.5625rem;
          font-weight: 800;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(181, 18, 36, 0.4);
        }

        @media (max-width: 375px) {
          .brand-wordmark {
            font-size: 0.90rem;
            letter-spacing: 0.08em;
          }
        }

        @media (min-width: 480px) {
          .brand-wordmark {
            font-size: 1.12rem;
            letter-spacing: 0.14em;
          }
        }

        @media (min-width: 769px) {
          .wishlist-header-btn {
            display: flex;
          }
        }

        @media (min-width: 861px) {
          .header-inner {
            display: flex;
            justify-content: space-between;
            height: 72px;
          }
          .mobile-toggle {
            display: none !important;
          }
          .desktop-nav {
            display: flex !important;
            align-items: center;
            gap: 1.75rem;
          }
          .header-left {
            gap: 2rem;
          }
          .header-right {
            gap: 1.25rem;
          }
          .brand-wordmark {
            font-size: 1.35rem;
            letter-spacing: 0.18em;
          }
          .currency-selector {
            display: flex !important;
            align-items: center;
            gap: 4px;
          }
          .currency-label {
            font-size: 0.75rem;
            font-weight: 800;
            color: #0a0a0a;
            letter-spacing: 0.04em;
          }
          .desktop-search-label {
            display: inline !important;
            font-size: 0.6875rem;
            font-weight: 600;
            color: #888888;
            letter-spacing: 0.05em;
            margin-left: 6px;
          }
          .admin-btn {
            display: flex !important;
            align-items: center;
            gap: 4px;
            border: 1px solid #e7e5e3 !important;
            padding: 4px 8px !important;
            font-size: 0.6875rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.08em !important;
          }
          .admin-btn.active {
            background: #0a0a0a !important;
            color: #ffffff !important;
          }
          .desktop-admin-label {
            display: inline !important;
          }
        }
      `}</style>
    </>
  );
};
