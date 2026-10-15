import React, { useEffect, useState } from 'react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';
import { Product } from '../../types';

interface WishlistDrawerProps {
  onNavigate: (path: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onNavigate }) => {
  const { wishlist, isWishlistOpen, closeWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    if (isWishlistOpen && wishlist.length > 0) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const all = await api.getProducts();
          setProducts(all.filter((p) => wishlist.includes(p.id)));
        } catch (err) {
          console.error('Error fetching wishlisted products:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isWishlistOpen, wishlist]);

  if (!isWishlistOpen) return null;

  const handleMoveToBag = async (product: Product) => {
    const firstAvailable = product.variants.find((v) => v.available_quantity > 0) || product.variants[0];
    if (!firstAvailable) return;

    try {
      setAddingId(product.id);
      await addToCart(firstAvailable.id, 1);
    } finally {
      setAddingId(null);
    }
  };

  const handleViewProduct = (slug: string) => {
    closeWishlist();
    onNavigate(`/products/${slug}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="drawer-backdrop active"
        onClick={closeWishlist}
        style={{ zIndex: 1100 }}
      />

      {/* Slideout Panel */}
      <div
        className="cart-drawer-panel open"
        style={{
          zIndex: 1105,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e7e5e3',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="#b51224" fill="#b51224" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              YOUR WISHLIST
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#6b6b6b',
                fontWeight: 700,
              }}
            >
              ({wishlist.length})
            </span>
          </div>

          <button
            onClick={closeWishlist}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              color: '#0a0a0a',
            }}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {wishlist.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem',
                padding: '2rem 1rem',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f7f6f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b6b6b',
                }}
              >
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase' }}>
                YOUR WISHLIST IS EMPTY
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b6b6b', maxWidth: '280px', lineHeight: 1.6 }}>
                Bookmark your favorite luxury garments from the Autumn / Winter Archive for easy access.
              </p>
              <button
                onClick={() => {
                  closeWishlist();
                  onNavigate('/collections');
                }}
                className="btn-primary"
                style={{ marginTop: '0.75rem', fontSize: '0.75rem', padding: '0.75rem 1.5rem' }}
              >
                EXPLORE ARCHIVE
              </button>
            </div>
          ) : loading && products.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '90px' }} className="skeleton" />
              <div style={{ height: '90px' }} className="skeleton" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {products.map((product) => {
                const isAdding = addingId === product.id;
                return (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      border: '1px solid #f0efed',
                      backgroundColor: '#faf9f8',
                      position: 'relative',
                      alignItems: 'center',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => handleViewProduct(product.slug)}
                      style={{
                        width: '70px',
                        height: '90px',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={product.cover_image}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        onClick={() => handleViewProduct(product.slug)}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          color: '#0a0a0a',
                          cursor: 'pointer',
                          lineHeight: 1.3,
                          marginBottom: '4px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.title}
                      </p>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 900,
                          color: product.is_sale ? '#b51224' : '#0a0a0a',
                          marginBottom: '8px',
                        }}
                      >
                        {formatPrice(product.price)}
                      </p>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          disabled={isAdding}
                          onClick={() => handleMoveToBag(product)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#0a0a0a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 10px',
                            fontSize: '0.6875rem',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          <ShoppingBag size={12} />
                          <span>{isAdding ? 'ADDING...' : 'ADD TO BAG'}</span>
                        </button>

                        <button
                          onClick={() => toggleWishlist(product.id, product.title)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#888888',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid #e7e5e3',
              backgroundColor: '#faf9f8',
            }}
          >
            <button
              onClick={() => {
                closeWishlist();
                onNavigate('/collections');
              }}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.75rem', justifyContent: 'center' }}
            >
              <span>CONTINUE BROWSING</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
