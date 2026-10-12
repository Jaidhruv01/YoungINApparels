import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { api } from '../../services/api';
import { useCurrency } from '../../context/CurrencyContext';

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

  const trendingQueries = ['CASHMERE OVERCOAT', '500GSM HOODIE', 'RAW DENIM', 'LUG-SOLE CHELSEA', 'TACTICAL BOMBER'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSuggestions([]);
      setMatchingProducts([]);
    }
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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 10, 10, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header Bar */}
      <div
        className="container-custom"
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid #262626',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              fontWeight: 700,
            }}
          >
            <span>ESC</span>
            <X size={20} />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search size={28} color="#888888" style={{ position: 'absolute', left: '16px' }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH THE ATELIER CATALOG (E.G. COAT, FLEECE, DENIM)..."
              style={{
                width: '100%',
                padding: '1.25rem 3.5rem 1.25rem 4rem',
                backgroundColor: '#181818',
                border: '1px solid #333333',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1rem, 2vw, 1.35rem)',
                letterSpacing: '0.06em',
                outline: 'none',
              }}
            />
            {query && (
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CornerDownLeft size={18} />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Content Area */}
      <div
        className="container-custom"
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingTop: '2.5rem',
          paddingBottom: '3rem',
          color: '#ffffff',
        }}
      >
        {/* If no query, show trending */}
        {!query && (
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#888888',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              TRENDING ARCHIVE INQUIRIES
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {trendingQueries.map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  style={{
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #333333',
                    color: '#ffffff',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#b51224';
                    e.currentTarget.style.color = '#b51224';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333333';
                    e.currentTarget.style.color = '#ffffff';
                  }}
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
              <p style={{ color: '#888888', fontSize: '0.875rem' }}>Scanning archive inventory...</p>
            ) : matchingProducts.length > 0 ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', color: '#888888' }}>
                    MATCHING PIECES ({matchingProducts.length})
                  </p>
                  <button
                    onClick={handleSearchSubmit}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#b51224',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    VIEW ALL RESULTS <ArrowRight size={14} />
                  </button>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {matchingProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p.slug)}
                      style={{
                        backgroundColor: '#161616',
                        border: '1px solid #282828',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'transform 0.2s ease, border-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#b51224';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = '#282828';
                      }}
                    >
                      <div style={{ aspectRatio: '3/4', overflow: 'hidden' }}>
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.6875rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {p.category}
                        </span>
                        <h4
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase',
                            marginTop: '2px',
                            marginBottom: '6px',
                            color: '#ffffff',
                          }}
                        >
                          {p.title}
                        </h4>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9375rem' }}>
                            {formatPrice(p.price)}
                          </span>
                          {p.compare_at_price && (
                            <span style={{ textDecoration: 'line-through', color: '#777', fontSize: '0.8125rem' }}>
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
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <p style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
                  NO PIECES FOUND MATCHING "{query}"
                </p>
                <p style={{ fontSize: '0.875rem', color: '#888888', marginBottom: '1.5rem' }}>
                  Please verify spelling or search by general categories such as outerwear, fleece, denim, or footwear.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="btn-white"
                  style={{ fontSize: '0.75rem' }}
                >
                  CLEAR SEARCH
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
