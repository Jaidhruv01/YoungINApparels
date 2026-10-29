import React, { useState } from 'react';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight } from 'lucide-react';

import { MaskedRevealHeader } from '../common/MaskedRevealHeader';

interface ProductTabsProps {
  products: Product[];
  onNavigate: (path: string) => void;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ products, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'bestsellers' | 'sale'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'new') return p.is_new;
    if (activeTab === 'bestsellers') return p.is_bestseller;
    if (activeTab === 'sale') return p.is_sale;
    return true;
  });

  const tabs = [
    { id: 'all', label: 'ALL GEAR' },
    { id: 'new', label: 'NEW ARRIVALS' },
    { id: 'bestsellers', label: 'BEST SELLERS' },
    { id: 'sale', label: 'SPECIAL EDITIONS' },
  ];

  return (
    <section
      className="section-editorial-break"
      style={{
        paddingTop: '6rem',
        paddingBottom: '6rem',
        backgroundColor: '#f5f5f5',
        color: '#111111',
      }}
    >
      <div className="container-custom">
        {/* Section Header & Tabs */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '3.5rem',
            textAlign: 'center',
          }}
        >
          <MaskedRevealHeader
            tag="NEW PERSPECTIVE // THE SELECTED"
            lines={['THE LAUNCH CAPSULE', 'CORE ESSENTIALS']}
            italicSuffix="Edition 01"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 2.75rem)',
              lineHeight: 1.12,
              marginBottom: '1.75rem',
              color: '#111111',
              textAlign: 'center',
            }}
          />

          {/* Tab Buttons */}
          <div
            className="touch-scroll-x tabs-scroll-container"
            style={{
              display: 'flex',
              maxWidth: '100%',
              justifyContent: 'center',
              gap: '0.25rem',
              borderBottom: '1px solid #e7e5e3',
              paddingBottom: '0.25rem',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    color: isActive ? '#0a0a0a' : '#888888',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {tab.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-1px',
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
          </div>
        </div>

        {/* Product Grid */}
        <div className="responsive-product-grid" style={{ marginBottom: '3.5rem' }}>
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => onNavigate('/collections')}
            className="btn-secondary"
            style={{ padding: '1rem 2.5rem' }}
          >
            <span>VIEW ALL GEAR</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
