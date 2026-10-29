import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

import { smoothScrollEngine } from '../../utils/smoothScroll';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);

  const trendingQueries = ['350GSM LOWERS', 'PREMIUM COMPRESSIONS', '270GSM LOWERS', 'RIBBED VESTS', 'TANK TOPS', 'BASIC COMPRESSIONS'];

  useEffect(() => {
    if (isOpen) {
      smoothScrollEngine.lockScroll();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      smoothScrollEngine.unlockScroll();
      setQuery('');
      setSuggestions([]);
      setMatchingProducts([]);
    }
    return () => {
      smoothScrollEngine.unlockScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setMatchingProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await api.getSearchSuggestions(query);
        setSuggestions(data.suggestions || []);
        setMatchingProducts(data.products || []);
      } catch (err) {
        console.error('Search suggestion error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug: string) => {
    onClose();
    onNavigate(`/products/${slug}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    onNavigate(`/collections?q=${encodeURIComponent(query)}`);
  };

  return (
    <div
      className="search-overlay-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none',
        transform: isOpen ? 'scale(1)' : 'scale(0.98)',
        transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s',
      }}
    >
      {/* Header Bar */}
      <div
        className="container-custom search-overlay-header"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 900, letterSpacing: '0.12em', color: '#ffffff' }}>
              YOUNG<span style={{ color: '#b51224' }}>IN</span>
            </span>
            <span style={{ color: '#444444' }}>|</span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#888888', letterSpacing: '0.14em' }}>
              ARCHIVE SEARCH
            </span>
          </div>

          <button
            onClick={onClose}
            className="search-overlay-close-btn"
            aria-label="Close search"
          >
            <span className="close-text">CLOSE</span>
            <X size={20} />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search className="search-input-icon" color="#888888" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH GYMWEAR (COMPRESSION, LOWERS, TANKS)..."
              className="search-main-input"
            />
            {query && (
              <div style={{ position: 'absolute', right: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  style={{
                    background: '#242424',
                    border: 'none',
                    color: '#aaaaaa',
                    cursor: 'pointer',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Clear text"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#b51224',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                  }}
                  title="Submit search"
                  aria-label="Search"
                >
                  <CornerDownLeft size={14} />
                </button>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div
        className="container-custom search-overlay-content"
      >
        {/* If no query, show trending */}
        {!query && (
          <div>
            <p
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.14em',
                color: '#888888',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              TRENDING ARCHIVE INQUIRIES
            </p>
            <div className="trending-tags-container">
              {trendingQueries.map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="trending-tag-btn"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query && (
          <div>
            {loading ? (
              <p style={{ color: '#888888', fontSize: '0.875rem', letterSpacing: '0.04em' }}>Scanning archive inventory...</p>
            ) : matchingProducts.length > 0 ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', color: '#888888' }}>
                    MATCHING PIECES ({matchingProducts.length})
                  </p>
                  <button
                    onClick={handleSearchSubmit}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b51224',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    VIEW ALL RESULTS <ArrowRight size={14} />
                  </button>
                </div>

                <div className="search-results-grid">
                  {matchingProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.slug)}
                      className="search-product-card"
                    >
                      <div style={{ aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#1c1c1c' }}>
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '0.875rem' }}>
                        <span style={{ fontSize: '0.625rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                          {p.category}
                        </span>
                        <h4
                          className="search-card-title"
                        >
                          {p.title}
                        </h4>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.875rem' }}>
                            {formatPrice(p.price)}
                          </span>
                          {p.compare_at_price && (
                            <span style={{ textDecoration: 'line-through', color: '#777', fontSize: '0.75rem' }}>
                              {formatPrice(p.compare_at_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <p style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem', fontWeight: 800 }}>
                  NO PIECES FOUND MATCHING "{query}"
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#888888', marginBottom: '1.5rem', maxWidth: '480px', marginInline: 'auto' }}>
                  Please verify spelling or search by activewear categories such as compression, joggers, tank tops, or training vests.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="btn-white"
                  style={{ fontSize: '0.75rem', padding: '0.75rem 1.5rem' }}
                >
                  CLEAR SEARCH
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .search-overlay-header {
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #222222;
        }
        .search-overlay-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          font-weight: 800;
          padding: 8px 14px;
          border-radius: 2px;
          min-height: 40px;
          transition: background-color 0.2s ease, transform 0.15s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .search-overlay-close-btn:active {
          transform: scale(0.94);
          background-color: rgba(255, 255, 255, 0.15);
        }
        .search-input-icon {
          position: absolute;
          left: 14px;
          width: 20px;
          height: 20px;
          pointer-events: none;
        }
        .search-main-input {
          width: 100%;
          padding: 1rem 4.5rem 1rem 2.85rem;
          background-color: #161616;
          border: 1px solid #2a2a2a;
          color: #ffffff;
          font-family: var(--font-display);
          font-size: 16px;
          letter-spacing: 0.05em;
          outline: none;
          border-radius: 2px;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .search-main-input:focus {
          border-color: #b51224;
          background-color: #1a1a1a;
        }
        .search-overlay-content {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding-top: 2rem;
          padding-bottom: 3rem;
          color: #ffffff;
        }
        .trending-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .trending-tag-btn {
          background-color: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #ffffff;
          padding: 0.5rem 0.95rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.18s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .trending-tag-btn:hover {
          border-color: #b51224;
          color: #b51224;
        }
        .trending-tag-btn:active {
          transform: scale(0.95);
        }
        .search-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 1.25rem;
        }
        .search-product-card {
          background-color: #141414;
          border: 1px solid #242424;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s ease, border-color 0.2s ease;
          border-radius: 2px;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .search-product-card:hover {
          transform: translateY(-2px);
          border-color: #b51224;
        }
        .search-card-title {
          font-size: 0.8125rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin-top: 2px;
          margin-bottom: 6px;
          color: #ffffff;
          line-height: 1.3;
        }

        @media (max-width: 640px) {
          .search-overlay-header {
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
          .search-results-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.65rem !important;
          }
          .search-card-title {
            font-size: 0.72rem !important;
            margin-bottom: 4px !important;
          }
          .trending-tags-container {
            gap: 0.4rem;
          }
          .trending-tag-btn {
            font-size: 0.6875rem;
            padding: 0.4rem 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};
