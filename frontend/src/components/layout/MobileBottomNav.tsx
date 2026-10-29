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
  const isAdmin = currentPath.startsWith('/admin');
  const isProduct = currentPath.startsWith('/products/');
  if (isCheckout || isAdmin || isProduct) return null;

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
          <div className="nav-icon-wrapper">
            <Home size={19} />
            {isHome && <span className="nav-active-dot" />}
          </div>
          <span>HOME</span>
        </button>

        {/* Collections */}
        <button
          onClick={() => onNavigate('/collections')}
          className={`nav-tab ${isCollections ? 'active' : ''}`}
          aria-label="Collections"
        >
          <div className="nav-icon-wrapper">
            <Layers size={19} />
            {isCollections && <span className="nav-active-dot" />}
          </div>
          <span>GEAR</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="nav-tab"
          aria-label="Search"
        >
          <div className="nav-icon-wrapper">
            <Search size={19} />
          </div>
          <span>SEARCH</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={openWishlist}
          className="nav-tab"
          aria-label="Wishlist"
        >
          <div className="nav-icon-wrapper" style={{ position: 'relative' }}>
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="badge-pill-counter animate-pop">{wishlistCount}</span>
            )}
          </div>
          <span>SAVED</span>
        </button>

        {/* Shopping Bag */}
        <button
          onClick={openCart}
          className="nav-tab"
          aria-label="Cart Bag"
        >
          <div className="nav-icon-wrapper" style={{ position: 'relative' }}>
            <ShoppingBag size={19} />
            {cart && cart.item_count > 0 && (
              <span className="badge-pill-counter animate-pop">{cart.item_count}</span>
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
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 6px;
            padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
            box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.6);
            will-change: transform;
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
            gap: 3px;
            padding: 5px 0;
            transition: color 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.15s ease;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            -webkit-user-select: none;
          }

          .nav-icon-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 24px;
          }

          .nav-active-dot {
            position: absolute;
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #ffffff;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
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
            color: #ffffff;
          }

          .badge-pill-counter {
            position: absolute;
            top: -4px;
            right: -8px;
            background-color: #ffffff;
            color: #000000;
            font-size: 0.5rem;
            font-weight: 800;
            min-width: 16px;
            height: 16px;
            padding: 0 4px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1.5px solid #000000;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          }

          .badge-pill-counter.animate-pop {
            animation: badgePop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes badgePop {
            0% { transform: scale(0.6); }
            60% { transform: scale(1.25); }
            100% { transform: scale(1); }
          }
        }
      `}</style>
    </>
  );
};
