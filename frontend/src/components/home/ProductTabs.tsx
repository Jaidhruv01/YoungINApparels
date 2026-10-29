import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Product, Collection } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface ProductTabsProps {
  products: Product[];
  collections?: Collection[];
  onNavigate: (path: string) => void;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ products, collections = [], onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'bestsellers' | 'sale'>('new');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fallback sample circular collections if none provided from API
  const sampleCircles = [
    { title: 'COMPRESSION', slug: 'compression', image: '/images/product-bomber.jpg' },
    { title: 'HEAVYWEIGHT JOGGERS', slug: 'joggers', image: '/images/product-denim.jpg' },
    { title: 'TANKS & VESTS', slug: 'tanks-vests', image: '/images/product-sweater.jpg' },
    { title: 'OUTERWEAR CAPSULES', slug: 'compression', image: '/images/product-overcoat.jpg' },
    { title: 'ALL GEAR', slug: '', image: '/images/campaign-hero.jpg' },
  ];

  const displayCollections = collections.length > 0 ? collections : sampleCircles;

  const tabs: { id: 'new' | 'bestsellers' | 'sale'; label: string }[] = [
    { id: 'new', label: 'NEW ARRIVALS' },
    { id: 'bestsellers', label: 'BEST SELLERS' },
    { id: 'sale', label: 'SALE' },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'new') return p.is_new;
    if (activeTab === 'bestsellers') return p.is_bestseller;
    if (activeTab === 'sale') return p.is_sale;
    return true;
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      data-header-theme="light"
      style={{
        backgroundColor: '#f9f9f9',
        paddingTop: 'clamp(4rem, 8vw, 7rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7rem)',
        width: '100%',
        color: '#000000',
      }}
    >
      <div style={{ maxWidth: '1680px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 4rem)' }}>
        {/* Section 12 Item 93 & 97: Row of circular thumbnails (only place circles appear) + Drag Scrollable with Chevrons */}
        <div style={{ position: 'relative', marginBottom: '4rem' }}>
          {/* Left Arrow Button */}
          <button
            onClick={() => scrollCarousel('left')}
            aria-label="Scroll left"
            style={{
              position: 'absolute',
              left: '-14px',
              top: '36%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="collection-carousel-track"
            style={{
              display: 'flex',
              gap: 'clamp(1.5rem, 3.5vw, 3rem)',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              padding: '0.5rem 1rem',
              cursor: 'grab',
            }}
          >
            {displayCollections.map((col: any) => (
              <div
                key={col.title}
                onClick={() => onNavigate(col.slug ? `/collections/${col.slug}` : '/collections')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexShrink: 0,
                  cursor: 'pointer',
                  scrollSnapAlign: 'start',
                }}
                className="carousel-circle-item"
              >
                {/* Circular Thumbnail */}
                <div
                  style={{
                    width: 'clamp(72px, 8.5vw, 96px)',
                    height: 'clamp(72px, 8.5vw, 96px)',
                    borderRadius: '50%',
                    padding: '2px',
                    border: '1.5px solid #000000',
                    backgroundColor: '#ffffff',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
                  }}
                  className="carousel-circle-wrapper"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: '#eeeeee',
                    }}
                  >
                    <img
                      src={col.image || '/images/product-bomber.jpg'}
                      alt={col.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Circle Label */}
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#000000',
                    textAlign: 'center',
                    maxWidth: '100px',
                    lineHeight: 1.25,
                  }}
                >
                  {col.title}
                </span>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => scrollCarousel('right')}
            aria-label="Scroll right"
            style={{
              position: 'absolute',
              right: '-14px',
              top: '36%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Section 12 Items 94 & 95: Tabs with Framer Motion layoutId Sliding Underline */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '3rem',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '2rem' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.85rem 0.5rem',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? '#000000' : '#888888',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s ease',
                  }}
                >
                  <span>{tab.label}</span>

                  {/* Active Tab Sliding Underline (Radiant item #95) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      style={{
                        position: 'absolute',
                        bottom: '-1px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#000000',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 13: Strict 4-Column Grid on #F9F9F9 with Framer Motion fade & slide (Radiant items #96, #98) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'clamp(1rem, 2.5vw, 2rem)',
              marginBottom: '4rem',
            }}
            className="radiant-four-column-grid"
          >
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => onNavigate('/collections')}
            className="btn-stark-white"
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              border: '1px solid #000000',
              padding: '1rem 2.75rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.25s ease, color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ffffff';
            }}
          >
            <span>VIEW ALL PIECES</span>
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <style>{`
        .collection-carousel-track::-webkit-scrollbar {
          display: none;
        }
        .carousel-circle-item:hover .carousel-circle-wrapper {
          transform: scale(1.06);
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        }
        @media (max-width: 1024px) {
          .radiant-four-column-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .radiant-four-column-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </section>
  );
};
