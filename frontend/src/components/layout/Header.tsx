import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Globe } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

interface HeaderProps {
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, currentPath, onNavigate }) => {
  const { cart, openCart } = useCart();
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

  const navLinks = [
    { label: 'COLLECTIONS', path: '/collections' },
    { label: 'OUTERWEAR', path: '/collections/outerwear' },
    { label: 'FLEECE', path: '/collections/fleece-hoodies' },
    { label: 'DENIM', path: '/collections/denim' },
    { label: 'LOOKBOOK', path: '/lookbook' },
    { label: 'ATELIER', path: '/about' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          backgroundColor: '#ffffff',
          borderBottom: isScrolled ? '1px solid #e7e5e3' : '1px solid #f0efed',
          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
          boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
          }}
        >
          {/* Left: Mobile Toggle & Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                color: '#0a0a0a',
              }}
              className="mobile-toggle"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
              }}
              className="desktop-nav"
            >
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
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => handleNav('/')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
                  fontWeight: 900,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#0a0a0a',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                YOUNGIN<span style={{ color: '#b51224' }}>APPARELS</span>
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Currency Selector */}
            {/* Currency Indicator (Rupee Only) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="currency-selector">
              <Globe size={14} color="#6b6b6b" />
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#0a0a0a',
                  letterSpacing: '0.04em',
                }}
              >
                INR (₹)
              </span>
            </div>

            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px',
                color: '#0a0a0a',
                transition: 'color 0.2s ease',
              }}
              title="Search collection (⌘K)"
              aria-label="Search collection"
            >
              <Search size={19} />
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#888',
                  letterSpacing: '0.05em',
                }}
                className="desktop-search-label"
              >
                SEARCH
              </span>
            </button>

            {/* Admin Console Link */}
            <button
              onClick={() => handleNav('/admin')}
              style={{
                background: currentPath.startsWith('/admin') ? '#0a0a0a' : 'transparent',
                color: currentPath.startsWith('/admin') ? '#ffffff' : '#6b6b6b',
                border: '1px solid #e7e5e3',
                padding: '4px 8px',
                fontSize: '0.6875rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Admin Portal"
            >
              <Shield size={12} />
              <span className="desktop-admin-label">ADMIN</span>
            </button>

            {/* Bag / Cart Button */}
            <button
              onClick={openCart}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
                color: '#0a0a0a',
              }}
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={21} />
              {cart && cart.item_count > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    backgroundColor: '#b51224',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(181, 18, 36, 0.4)',
                  }}
                >
                  {cart.item_count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`drawer-backdrop ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '85%',
          maxWidth: '360px',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          zIndex: 999,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform var(--transition-smooth)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 900,
              letterSpacing: '0.16em',
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
            }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              style={{
                background: 'none',
                border: 'none',
                textAlign: 'left',
                color: currentPath === link.path ? '#b51224' : '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                padding: '6px 0',
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav('/admin')}
            style={{
              background: 'none',
              border: 'none',
              textAlign: 'left',
              color: '#b51224',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              padding: '6px 0',
              marginTop: '1rem',
            }}
          >
            ADMIN DASHBOARD →
          </button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #222222', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#888888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            AUTUMN / WINTER ARCHIVE 2026
          </p>
          <p style={{ fontSize: '0.6875rem', color: '#666666', marginTop: '0.25rem' }}>
            International D2C Atelier Flagship
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .desktop-search-label, .desktop-admin-label { display: none !important; }
          .currency-selector { display: none !important; }
        }
      `}</style>
    </>
  );
};
