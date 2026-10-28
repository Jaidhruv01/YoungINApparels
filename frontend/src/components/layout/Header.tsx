import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Globe, Heart, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';

interface HeaderProps {
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavSubItem {
  label: string;
  path: string;
  subtext?: string;
}

interface NavItem {
  label: string;
  path: string;
  tag?: string;
  subItems?: NavSubItem[];
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, currentPath, onNavigate }) => {
  const { cart, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const leftNavLinks: NavItem[] = [
    {
      label: 'COMPRESSION',
      path: '/collections/compression',
      tag: '2 TIERS',
      subItems: [
        { label: 'Basic Compression Tees', path: '/collections/basic-compressions', subtext: '4-Way Stretch Poly-Nylon Base' },
        { label: 'Premium Compression Tees', path: '/collections/premium-compressions', subtext: 'High-Tensile Muscle Support & Flatlock' },
      ],
    },
    {
      label: 'JOGGERS',
      path: '/collections/joggers',
      tag: '350/250 GSM',
      subItems: [
        { label: 'Heavyweight Joggers (350GSM)', path: '/collections/350gsm-lowers', subtext: 'Ultra-Heavyweight Architectural Fleece' },
        { label: 'Training Joggers (250GSM)', path: '/collections/250gsm-lowers', subtext: 'Lightweight Breathable French Terry' },
      ],
    },
    {
      label: 'TANKS & VESTS',
      path: '/collections/tanks-and-vests',
      tag: 'ATHLETIC',
      subItems: [
        { label: 'Premium Tank Tops', path: '/collections/tank-tops', subtext: 'Raw-Cut Deep Armhole Mobility Tanks' },
        { label: 'Training Vests', path: '/collections/ribbed-vests', subtext: '2x2 Heavy Cotton Ribbed Physique Vests' },
      ],
    },
  ];

  const rightNavLinks: NavItem[] = [
    {
      label: 'PREMIUM SERIES',
      path: '/collections/premium-series',
      tag: 'ELITE',
    },
    {
      label: 'TRACK MY ORDER',
      path: '/track-order',
      tag: 'PAN-INDIA',
    },
  ];

  const allNavLinks: NavItem[] = [...leftNavLinks, ...rightNavLinks];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    onNavigate(path);
  };

  const renderNavItems = (items: NavItem[], alignDropdownRight = false) => (
    <nav className="desktop-nav">
      {items.map((link) => {
        const isActive = currentPath === link.path || (link.subItems && link.subItems.some(s => s.path === currentPath));
        const isDropdownOpen = activeDropdown === link.label;

        return (
          <div
            key={link.label}
            className="nav-item-dropdown-container"
            onMouseEnter={() => link.subItems && setActiveDropdown(link.label)}
            onMouseLeave={() => setActiveDropdown(null)}
            style={{ position: 'relative' }}
          >
            <button
              onClick={() => handleNav(link.path)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive ? '#b51224' : '#0a0a0a',
                position: 'relative',
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{link.label}</span>
              {link.subItems && <ChevronDown size={11} color={isActive ? '#b51224' : '#888888'} />}
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

            {/* Desktop Dropdown Menu */}
            {link.subItems && isDropdownOpen && (
              <div
                className="desktop-dropdown-card"
                style={{
                  position: 'absolute',
                  top: '100%',
                  ...(alignDropdownRight ? { right: 0 } : { left: 0 }),
                  minWidth: '270px',
                  backgroundColor: '#0a0a0a',
                  color: '#ffffff',
                  border: '1px solid #222222',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                  padding: '0.75rem 0',
                  zIndex: 950,
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {link.subItems.map((sub) => (
                  <button
                    key={sub.path}
                    onClick={() => handleNav(sub.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      padding: '10px 18px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#161616')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span
                      style={{
                        color: currentPath === sub.path ? '#b51224' : '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {sub.label}
                    </span>
                    {sub.subtext && (
                      <span style={{ fontSize: '0.6875rem', color: '#888888' }}>
                        {sub.subtext}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-custom header-inner">
          {/* Left: Mobile Toggle & Left Desktop Nav */}
          <div className="header-left">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-toggle"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            {renderNavItems(leftNavLinks)}
          </div>

          {/* Center: Brand Wordmark (Strictly Centered, YOUNG in black, IN in red) */}
          <div className="header-center">
            <button
              onClick={() => handleNav('/')}
              className="brand-button"
              aria-label="YoungIN Home"
            >
              <span className="brand-wordmark">
                <span style={{ color: '#0a0a0a' }}>YOUNG</span>
                <span style={{ color: '#b51224' }}>IN</span>
              </span>
            </button>
          </div>

          {/* Right: Right Desktop Nav & Actions */}
          <div className="header-right">
            {renderNavItems(rightNavLinks, true)}

            {/* India Flag & Currency Selector (Desktop only) */}
            <div className="currency-selector">
              <Globe size={13} color="#b51224" />
              <span className="currency-label">INDIA (₹)</span>
            </div>

            {/* Wishlist Button (Desktop & Tablet) */}
            <button
              onClick={openWishlist}
              className="header-action-btn wishlist-header-btn"
              title="View saved items"
              aria-label="View saved items"
            >
              <Heart size={18} />
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
              <Search size={19} />
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
              <ShoppingBag size={20} />
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
        {/* Drawer Brand Bar (YOUNG in white/black, IN in red) */}
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
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '0.14em',
              whiteSpace: 'nowrap',
            }}
          >
            YOUNG<span style={{ color: '#b51224' }}>IN</span>
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
            <span>SEARCH GYMWEAR & LOWERS (⌘K)...</span>
          </button>
        </div>

        {/* Gymwear Category Nav Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {allNavLinks.map((link) => {
            const isActive = currentPath === link.path || (link.subItems && link.subItems.some(s => s.path === currentPath));

            if (link.subItems) {
              return (
                <div key={link.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleNav(link.path)}
                    style={{
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      color: isActive ? '#b51224' : '#ffffff',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      padding: '4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{link.label}</span>
                    <span
                      style={{
                        fontSize: '0.5625rem',
                        padding: '2px 6px',
                        backgroundColor: '#1f1f1f',
                        color: '#b51224',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 800,
                      }}
                    >
                      {link.tag}
                    </span>
                  </button>

                  {/* Sub-options for Compressions & Bottoms */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      paddingLeft: '0.85rem',
                      borderLeft: '2px solid #222222',
                      marginLeft: '4px',
                    }}
                  >
                    {link.subItems.map((sub) => (
                      <button
                        key={sub.path}
                        onClick={() => handleNav(sub.path)}
                        style={{
                          background: 'none',
                          border: 'none',
                          textAlign: 'left',
                          color: currentPath === sub.path ? '#b51224' : '#b0b0b0',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          padding: '3px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ color: '#b51224', fontSize: '0.625rem' }}>▸</span>
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            }

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
                  fontSize: '1.05rem',
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
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
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

          {/* Admin Dashboard Link */}
          <button
            onClick={() => handleNav('/admin')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              color: '#b51224',
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
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

        {/* Indian Gymwear Brand Info Card in Drawer */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #222222', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#999999' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#ffffff' }}>
              <Globe size={13} color="#b51224" />
              <span>INDIA (₹ INR)</span>
            </span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>FREE DELIVERY OVER ₹1,999</span>
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
                ATHLETE CONCIERGE (INDIA)
              </p>
              <p style={{ fontSize: '0.625rem', color: '#888888', marginTop: '2px' }}>
                Direct WhatsApp Sizing & Training Gear Advice
              </p>
            </div>
            <span style={{ color: '#b51224', fontSize: '0.875rem', fontWeight: 800 }}>→</span>
          </div>

          <p style={{ fontSize: '0.625rem', color: '#666666', marginTop: '0.25rem' }}>
            Engineered in India • High-Performance Athletic Gymwear
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
          grid-template-columns: minmax(44px, 1fr) auto minmax(80px, 1fr);
          align-items: center;
          height: 60px;
          width: 100%;
          column-gap: 0.5rem;
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
          padding: 0 0.25rem;
        }
        .header-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
          min-width: 0;
        }
        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          min-width: 44px;
          min-height: 44px;
          padding: 8px;
          margin-left: -8px;
          color: #0a0a0a;
          border-radius: 4px;
          transition: transform 0.15s ease, background-color 0.15s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .mobile-toggle:active {
          transform: scale(0.92);
          background-color: rgba(0, 0, 0, 0.05);
        }
        .desktop-nav {
          display: none;
        }
        .brand-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease, opacity 0.15s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .brand-button:active {
          transform: scale(0.96);
          opacity: 0.85;
        }
        .brand-wordmark {
          font-family: var(--font-display);
          font-size: 1.18rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0a0a0a;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          user-select: none;
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
          min-width: 40px;
          min-height: 40px;
          padding: 8px;
          color: #0a0a0a;
          position: relative;
          border-radius: 4px;
          transition: opacity 0.18s ease, transform 0.15s ease, background-color 0.18s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .header-action-btn:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }
        .header-action-btn:active {
          transform: scale(0.92);
          opacity: 0.75;
          background-color: rgba(0, 0, 0, 0.08);
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

        @media (max-width: 360px) {
          .header-inner {
            column-gap: 0.25rem;
            grid-template-columns: 40px auto 72px;
          }
          .brand-wordmark {
            font-size: 1.02rem;
            letter-spacing: 0.08em;
          }
          .header-action-btn {
            padding: 6px;
            min-width: 36px;
            min-height: 36px;
          }
        }

        @media (min-width: 361px) and (max-width: 480px) {
          .brand-wordmark {
            font-size: 1.15rem;
            letter-spacing: 0.12em;
          }
        }

        @media (min-width: 481px) and (max-width: 1023px) {
          .brand-wordmark {
            font-size: 1.32rem;
            letter-spacing: 0.14em;
          }
        }

        @media (min-width: 769px) {
          .wishlist-header-btn {
            display: flex;
          }
          .header-inner {
            grid-template-columns: minmax(44px, 1fr) auto minmax(120px, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .header-inner {
            grid-template-columns: 1fr auto 1fr !important;
            height: 70px;
            column-gap: 0.75rem;
          }
          .mobile-toggle {
            display: none !important;
          }
          .header-left {
            gap: 0.85rem !important;
          }
          .header-right {
            gap: 0.65rem !important;
          }
          .desktop-nav {
            display: flex !important;
            align-items: center;
            gap: 0.85rem !important;
          }
          .brand-wordmark {
            font-size: 1.45rem;
            letter-spacing: 0.16em;
          }
          .currency-selector {
            display: flex !important;
            align-items: center;
            gap: 4px;
          }
          .currency-label {
            font-size: 0.7rem;
            font-weight: 800;
            color: #0a0a0a;
            letter-spacing: 0.04em;
          }
          .desktop-search-label {
            display: none !important;
          }
          .admin-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            border: 1px solid #e7e5e3 !important;
            padding: 5px 8px !important;
            font-size: 0.6875rem !important;
            font-weight: 700 !important;
            letter-spacing: 0.08em !important;
          }
          .admin-btn.active {
            background: #0a0a0a !important;
            color: #ffffff !important;
          }
          .desktop-admin-label {
            display: none !important;
          }
        }

        @media (min-width: 1280px) {
          .header-inner {
            column-gap: 1.25rem;
          }
          .desktop-nav {
            gap: 1.25rem !important;
          }
          .header-right {
            gap: 0.85rem !important;
          }
          .desktop-search-label {
            display: inline !important;
            font-size: 0.6875rem;
            font-weight: 600;
            color: #888888;
            letter-spacing: 0.05em;
            margin-left: 6px;
          }
        }
      `}</style>
    </>
  );
};
