import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, Globe, User, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { smoothScrollEngine } from '../../utils/smoothScroll';

interface HeaderProps {
  onOpenSearch: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSearch, currentPath, onNavigate }) => {
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);
  const [headerTheme, setHeaderTheme] = useState<'light' | 'dark'>('light');
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const lastScrollYRef = useRef(0);
  const scrollUpDeltaRef = useRef(0);

  const isHomePage = currentPath === '/' || currentPath === '';

  // Scroll position & theme detector
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollYRef.current;

      // Scrolled past the hero threshold (viewport height minus 80px)
      const heroThreshold = Math.max(500, window.innerHeight - 80);
      const pastHero = currentY > heroThreshold;
      setIsScrolledPastHero(pastHero);

      // Hide / Reveal behavior on scroll
      if (currentY <= 60) {
        setIsHeaderHidden(false);
        scrollUpDeltaRef.current = 0;
      } else if (deltaY > 0) {
        // Scrolling down past 120px hides the header
        scrollUpDeltaRef.current = 0;
        if (currentY > 120) {
          setIsHeaderHidden(true);
          setActiveDropdown(null);
        }
      } else if (deltaY < 0) {
        // Scrolling up by >12px reveals the header
        scrollUpDeltaRef.current += Math.abs(deltaY);
        if (scrollUpDeltaRef.current > 12) {
          setIsHeaderHidden(false);
        }
      }

      // Detect background under header for theme switching (Radiant requirements #58 & #59)
      if (pastHero || !isHomePage) {
        try {
          const sampleEl = document.elementFromPoint(window.innerWidth / 2, 50);
          if (sampleEl) {
            const darkSection =
              sampleEl.closest('[data-header-theme="dark"]') ||
              sampleEl.closest('.dark-section') ||
              sampleEl.closest('footer') ||
              sampleEl.closest('#hero-narrative') ||
              sampleEl.closest('#lookbook-section');

            setHeaderTheme(darkSection ? 'dark' : 'light');
          }
        } catch {
          setHeaderTheme('light');
        }
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      smoothScrollEngine.lockScroll();
    } else {
      smoothScrollEngine.unlockScroll();
    }
    return () => {
      smoothScrollEngine.unlockScroll();
    };
  }, [mobileMenuOpen]);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    onNavigate(path);
  };

  // Determine current active colors
  // Over hero: transparent/subtle scrim with white text (Radiant requirement #57)
  // Scrolled past hero or on non-hero pages: solid white (black text) or solid black (white text) (Radiant requirement #58)
  const isOverHero = isHomePage && !isScrolledPastHero;
  const isDark = isOverHero || headerTheme === 'dark';

  const textColor = isDark ? '#ffffff' : '#000000';
  const bgColor = isOverHero
    ? 'rgba(0, 0, 0, 0.40)' // Dark protective scrim so white text is ALWAYS 100% visible over hero image
    : isDark
    ? 'rgba(0, 0, 0, 0.95)'
    : 'rgba(255, 255, 255, 0.98)';
  const borderColor = isOverHero
    ? 'rgba(255, 255, 255, 0.12)'
    : isDark
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(0, 0, 0, 0.08)';
  const badgeBg = isDark ? '#ffffff' : '#000000';
  const badgeText = isDark ? '#000000' : '#ffffff';

  return (
    <>
      <header
        className="single-sticky-header"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          backgroundColor: bgColor,
          color: textColor,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transform: isHeaderHidden ? 'translateY(-100%)' : 'translateY(0%)',
          transition:
            'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1800px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Left: Hamburger menu + SHOP, COLLECTION, MORE (Radiant requirement #54) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flex: 1 }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px',
                margin: '-6px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>

            {/* Desktop Nav: SHOP, COLLECTION, MORE */}
            <nav
              className="desktop-header-nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
              }}
            >
              {/* SHOP with dropdown */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setActiveDropdown('shop')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNav('/collections')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: textColor,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 0',
                  }}
                  className="link-hover-underline"
                >
                  <span>SHOP</span>
                  <ChevronDown size={12} strokeWidth={1.5} />
                </button>

                {activeDropdown === 'shop' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '240px',
                      backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                      color: isDark ? '#ffffff' : '#000000',
                      border: `1px solid ${isDark ? '#262626' : '#eaeaea'}`,
                      padding: '0.75rem 0',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                      zIndex: 100,
                    }}
                  >
                    {[
                      { label: 'ALL PRODUCTS', path: '/collections' },
                      { label: 'COMPRESSION WEAR', path: '/collections/compression' },
                      { label: 'HEAVYWEIGHT JOGGERS', path: '/collections/joggers' },
                      { label: 'TANKS & STRINGERS', path: '/collections/tanks-vests' },
                      { label: 'PREMIUM SERIES', path: '/collections/premium-compressions' },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNav(item.path)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          padding: '8px 20px',
                          color: 'inherit',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          cursor: 'pointer',
                          display: 'block',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? '#1a1a1a' : '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* COLLECTION */}
              <button
                onClick={() => handleNav('/lookbook')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: textColor,
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '8px 0',
                }}
                className="link-hover-underline"
              >
                COLLECTION
              </button>

              {/* MORE with dropdown */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setActiveDropdown('more')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: textColor,
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 0',
                  }}
                  className="link-hover-underline"
                >
                  <span>MORE</span>
                  <ChevronDown size={12} strokeWidth={1.5} />
                </button>

                {activeDropdown === 'more' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '200px',
                      backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                      color: isDark ? '#ffffff' : '#000000',
                      border: `1px solid ${isDark ? '#262626' : '#eaeaea'}`,
                      padding: '0.75rem 0',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                      zIndex: 100,
                    }}
                  >
                    {[
                      { label: 'ABOUT', path: '/about' },
                      { label: 'FAQ & CARE', path: '/faq' },
                      { label: 'CONTACT', path: '/contact' },
                      { label: 'TRACK ORDER', path: '/track-order' },
                      { label: 'ATELIER ADMIN', path: '/admin' },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNav(item.path)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          padding: '8px 20px',
                          color: 'inherit',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          cursor: 'pointer',
                          display: 'block',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? '#1a1a1a' : '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Center: Brand wordmark in lowercase bold sans-serif (Radiant requirement #55) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={() => handleNav('/')}
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                padding: '4px 8px',
                textDecoration: 'none',
              }}
              aria-label="Youngin Home"
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  textTransform: 'lowercase',
                  lineHeight: 1,
                  display: 'inline-block',
                }}
              >
                youngin
              </span>
            </button>
          </div>

          {/* Right: language selector, search icon, profile icon, bag icon with item count (Radiant requirement #56) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1.25rem', flex: 1 }}>
            {/* Language / Region Selector */}
            <div
              className="desktop-currency-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                color: textColor,
                opacity: 0.85,
              }}
              title="Region: India (₹)"
            >
              <Globe size={14} strokeWidth={1.5} />
              <span>IN (₹)</span>
            </div>

            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              aria-label="Search collection"
              title="Search collection (⌘K)"
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Profile / Account Icon */}
            <button
              onClick={() => handleNav('/track-order')}
              aria-label="Account and orders"
              title="Track Order / Account"
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <User size={18} strokeWidth={1.5} />
            </button>

            {/* Bag Icon with Item Count & Scale Pop Animation (Radiant requirement #62) */}
            <button
              onClick={openCart}
              aria-label="Open bag"
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cart && cart.item_count > 0 && (
                <motion.span
                  key={cart.item_count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                  style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-4px',
                    backgroundColor: badgeBg,
                    color: badgeText,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    lineHeight: 1,
                  }}
                >
                  {cart.item_count}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in Full-Height Mobile / Global Menu (Radiant requirement #60: Framer Motion x: -100% to 0) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: '#000000',
                zIndex: 1000,
              }}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '420px',
                backgroundColor: '#000000',
                color: '#ffffff',
                zIndex: 1001,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                borderRight: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {/* Drawer Top Bar */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    textTransform: 'lowercase',
                  }}
                >
                  youngin
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '6px',
                  }}
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Drawer Body */}
              <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
                {/* Search in Drawer */}
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
                    padding: '12px 14px',
                    backgroundColor: '#121212',
                    border: '1px solid #262626',
                    color: '#888888',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Search size={16} strokeWidth={1.5} />
                  <span>Search collection...</span>
                </button>

                {/* Primary Nav Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#666666', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    COLLECTIONS
                  </div>
                  {[
                    { label: 'ALL PRODUCTS', path: '/collections' },
                    { label: 'COMPRESSION WEAR', path: '/collections/compression' },
                    { label: 'HEAVYWEIGHT JOGGERS', path: '/collections/joggers' },
                    { label: 'TANKS & STRINGERS', path: '/collections/tanks-vests' },
                    { label: 'PREMIUM SERIES', path: '/collections/premium-compressions' },
                    { label: 'LOOKBOOK / SERIES 01', path: '/lookbook' },
                  ].map((link) => (
                    <button
                      key={link.path}
                      onClick={() => handleNav(link.path)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: currentPath === link.path ? '#ffffff' : '#b0b0b0',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        textAlign: 'left',
                        cursor: 'pointer',
                        padding: '4px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronRight size={14} color="#666" />
                    </button>
                  ))}
                </div>

                {/* Secondary Info Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#666666', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    ATELIER INFORMATION
                  </div>
                  {[
                    { label: 'About the Atelier', path: '/about' },
                    { label: 'Track Order', path: '/track-order' },
                    { label: 'FAQ & Care Instructions', path: '/faq' },
                    { label: 'Contact Us', path: '/contact' },
                    { label: 'Atelier Console Admin', path: '/admin' },
                  ].map((link) => (
                    <button
                      key={link.path}
                      onClick={() => handleNav(link.path)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#999999',
                        fontSize: '0.875rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        padding: '3px 0',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#999999')}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.75rem',
                  color: '#666666',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>© {new Date().getFullYear()} youngin</span>
                <span>INDIA (₹)</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-header-nav,
          .desktop-currency-pill {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
