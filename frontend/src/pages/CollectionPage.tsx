import React, { useState, useEffect } from 'react';
import { Product, Collection } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface CollectionPageProps {
  collectionSlug?: string;
  searchQuery?: string;
  onNavigate: (path: string) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  collectionSlug,
  searchQuery,
  onNavigate,
}) => {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [collectionInfo, setCollectionInfo] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (collectionSlug) {
          const detail = await api.getCollectionBySlug(collectionSlug);
          setCollectionInfo(detail);
          setProducts(detail.products);
        } else {
          const prodList = await api.getProducts({ q: searchQuery });
          setProducts(prodList);
          setCollectionInfo({
            id: 0,
            title: searchQuery ? `SEARCH: "${searchQuery.toUpperCase()}"` : 'COMPLETE GEAR COLLECTION',
            slug: 'all',
            description: searchQuery
              ? `Archival garments corresponding to '${searchQuery}'.`
              : 'Engineered for the grind. High-performance activewear featuring 4-way stretch poly-nylon compression wear, 350GSM & 250GSM joggers, and training tanks.',
            sort_order: 0,
            active: true,
          });
        }
      } catch (err) {
        console.error('Failed to load collection products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [collectionSlug, searchQuery]);

  // Distinct options
  const categories = ['All', 'Compressions', 'Bottoms', 'Tank Tops', 'Ribbed Vests'];
  const sizes = ['All', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['All', 'Midnight Black', 'Washed Charcoal', 'Campaign Crimson', 'Carbon Black', 'Obsidian Black'];

  // Apply client filtering
  const filteredProducts = products.filter((p) => {
    // Category
    if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    // Size
    if (selectedSize !== 'All') {
      const hasSize = p.variants.some((v) => v.size.toLowerCase() === selectedSize.toLowerCase());
      if (!hasSize) return false;
    }

    // Color
    if (selectedColor !== 'All') {
      const hasColor = p.variants.some((v) => v.color.toLowerCase() === selectedColor.toLowerCase());
      if (!hasColor) return false;
    }

    // In Stock Only
    if (inStockOnly) {
      const hasStock = p.variants.some((v) => v.available_quantity > 0);
      if (!hasStock) return false;
    }

    // Max Price
    if (p.price > maxPrice) {
      return false;
    }

    return true;
  });

  // Apply client sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'bestseller') return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
    return b.id - a.id;
  });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setInStockOnly(false);
    setMaxPrice(35000);
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSize !== 'All' ||
    selectedColor !== 'All' ||
    inStockOnly ||
    maxPrice < 35000;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', paddingBottom: '6rem' }}>
      {/* Hero Header */}
      <div
        style={{
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          paddingTop: '4.5rem',
          paddingBottom: '4.5rem',
          borderBottom: '1px solid #222222',
        }}
      >
        <div className="container-custom">
          <div style={{ maxWidth: '780px' }}>
            <span className="eyebrow" style={{ color: '#b51224', display: 'inline-block', marginBottom: '0.75rem' }}>
              YOUNGIN ARCHIVE // CATALOG
            </span>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 5.5vw, 3.75rem)',
                lineHeight: 1.12,
                wordBreak: 'break-word',
                marginBottom: '1rem',
                color: '#ffffff',
              }}
            >
              {collectionInfo?.title || 'THE COLLECTION'}
            </h1>
            <p style={{ color: '#a0a0a0', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '640px' }}>
              {collectionInfo?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Sort Controls Bar */}
      <div
        style={{
          borderBottom: '1px solid #e7e5e3',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: '70px',
          zIndex: 800,
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        >
          {/* Left: Filter Toggle & Count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
            >
              <SlidersHorizontal size={14} />
              <span>FILTERS {hasActiveFilters && '(ACTIVE)'}</span>
            </button>

            <span style={{ fontSize: '0.8125rem', color: '#6b6b6b', fontWeight: 600 }}>
              SHOWING {sortedProducts.length} PIECES
            </span>
          </div>

          {/* Right: Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b6b6b', letterSpacing: '0.08em' }} className="sort-label">
              SORT:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid #e7e5e3',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                outline: 'none',
                textTransform: 'uppercase',
              }}
            >
              <option value="newest">NEWEST ARRIVALS</option>
              <option value="price_asc">PRICE: LOW TO HIGH</option>
              <option value="price_desc">PRICE: HIGH TO LOW</option>
              <option value="bestseller">BEST SELLERS</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div
            className="container-custom"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
              paddingBottom: '0.75rem',
            }}
          >
            {selectedCategory !== 'All' && (
              <span className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Category: {selectedCategory}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {selectedSize !== 'All' && (
              <span className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Size: {selectedSize}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedSize('All')} />
              </span>
            )}
            {selectedColor !== 'All' && (
              <span className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Color: {selectedColor}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedColor('All')} />
              </span>
            )}
            {inStockOnly && (
              <span className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                In Stock Only
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)} />
              </span>
            )}
            {maxPrice < 35000 && (
              <span className="badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Max Price: {formatPrice(maxPrice)}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setMaxPrice(35000)} />
              </span>
            )}
            <button
              onClick={resetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: '#b51224',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: '6px',
                textDecoration: 'underline',
              }}
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="container-custom" style={{ paddingTop: '2.5rem' }}>
        {loading ? (
          <div className="responsive-product-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} style={{ height: '380px' }} className="skeleton" />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <h3 style={{ fontSize: '1.35rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              NO GARMENTS MATCH YOUR SELECTION
            </h3>
            <p style={{ color: '#6b6b6b', fontSize: '0.875rem', marginBottom: '2rem' }}>
              Try adjusting your active filters or reset your criteria to view the entire YoungIN gear archive.
            </p>
            <button onClick={resetFilters} className="btn-primary">
              <RotateCcw size={16} />
              <span>RESET FILTERS</span>
            </button>
          </div>
        ) : (
          <div className="responsive-product-grid">
            {sortedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile / Slide-in Filter Drawer */}
      <div
        className={`drawer-backdrop ${mobileFilterOpen ? 'active' : ''}`}
        onClick={() => setMobileFilterOpen(false)}
        style={{
          visibility: mobileFilterOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#ffffff',
          zIndex: 999,
          transform: mobileFilterOpen ? 'translateX(0)' : 'translateX(-100%)',
          visibility: mobileFilterOpen ? 'visible' : 'hidden',
          pointerEvents: mobileFilterOpen ? 'auto' : 'none',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '10px 0 40px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e7e5e3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={18} />
            <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase' }}>FILTER ARCHIVE</h3>
          </div>
          <button
            onClick={() => setMobileFilterOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {/* Category Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
              CATEGORY
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
              SIZE
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    backgroundColor: selectedSize === s ? '#0a0a0a' : '#ffffff',
                    color: selectedSize === s ? '#ffffff' : '#0a0a0a',
                    border: '1px solid #e7e5e3',
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
              COLORWAY
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {colors.map((c) => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="color"
                    checked={selectedColor === c}
                    onChange={() => setSelectedColor(c)}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                MAX PRICE
              </h4>
              <span style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="35000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#b51224' }}
            />
          </div>

          {/* In Stock Toggle */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>ONLY SHOW IN-STOCK PIECES</span>
            </label>
          </div>
        </div>

        {/* Footer Apply & Reset */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #e7e5e3', display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={resetFilters}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.75rem' }}
          >
            RESET
          </button>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="btn-primary"
            style={{ flex: 1, padding: '0.75rem' }}
          >
            APPLY ({sortedProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
};
