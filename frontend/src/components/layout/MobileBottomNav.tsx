import React from 'react';
import { Home, Layers, Search, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
}) => {
  const { cart, openCart } = useCart();
  const { wishlistCount, openWishlist } = useWishlist();

  const isCheckout = currentPath === '/checkout';
  if (isCheckout) return null;

  const isHome = currentPath === '/' || currentPath === '';
  const isCollections = currentPath.startsWith('/collections');

  return (
    <>
      <div className="mobile-bottom-nav">
        {/* Home */}
        <button
          onClick={() => onNavigate('/')}
          className={`nav-tab ${isHome ? 'active' : ''}`}
          aria-label="Home"
        >
          <Home size={19} />
          <span>HOME</span>
        </button>

        {/* Collections */}
        <button
          onClick={() => onNavigate('/collections')}
          className={`nav-tab ${isCollections ? 'active' : ''}`}
          aria-label="Collections"
        >
          <Layers size={19} />
          <span>ARCHIVE</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="nav-tab"
          aria-label="Search"
        >
          <Search size={19} />
          <span>SEARCH</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={openWishlist}
          className="nav-tab relative"
          aria-label="Wishlist"
        >
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="badge-pill-counter">{wishlistCount}</span>
            )}
          </div>
          <span>SAVED</span>
        </button>

        {/* Shopping Bag */}
        <button
          onClick={openCart}
          className="nav-tab relative"
          aria-label="Cart Bag"
        >
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <ShoppingBag size={19} />
            {cart && cart.item_count > 0 && (
              <span className="badge-pill-counter">{cart.item_count}</span>
            )}
          </div>
          <span>BAG</span>
        </button>
      </div>

      <style>{`
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 850;
            background: rgba(10, 10, 10, 0.94);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid #1f1f1f;
            padding-top: 8px;
            padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
            box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);
          }

          .nav-tab {
            background: none;
            border: none;
            color: #888888;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 4px 0;
            transition: color 0.15s ease, transform 0.15s ease;
          }

          .nav-tab span {
            font-size: 0.5625rem;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .nav-tab.active {
            color: #ffffff;
          }

          .nav-tab:active {
            transform: scale(0.92);
          }

          .badge-pill-counter {
            position: absolute;
            top: -4px;
            right: -8px;
            background-color: #b51224;
            color: #ffffff;
            font-size: 0.5rem;
            font-weight: 800;
            min-width: 15px;
            height: 15px;
            padding: 0 3px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #0a0a0a;
          }
        }
      `}</style>
    </>
  );
};
