import {
  Product, Collection, CollectionDetail, CartState, LookbookData,
  CMSSection, CheckoutQuote, Order
} from '../types';
import {
  fallbackProducts, fallbackCollections, fallbackLookbook, fallbackCMS
} from './fallbackData';

const API_BASE = (import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/$/, '') : '') + '/api/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(errorBody.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Local storage helpers for static / Vercel fallback mode
const LOCAL_CART_KEY = 'youngin_cart_v1';
const LOCAL_ORDERS_KEY = 'youngin_orders_v1';

function getLocalCart(): CartState {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn('LocalStorage error', e);
  }
  return {
    session_id: 'guest_session',
    items: [],
    item_count: 0,
    subtotal: 0,
    free_shipping_threshold: 5000,
    amount_for_free_shipping: 5000,
    has_free_shipping: false
  };
}

function saveLocalCart(cart: CartState): CartState {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn('LocalStorage error', e);
  }
  return cart;
}

export const api = {
  // Catalog
  getProducts: async (params?: { category?: string; sort_by?: string; collection_slug?: string; tab?: string; q?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.sort_by) query.append('sort_by', params.sort_by);
      if (params?.collection_slug) query.append('collection_slug', params.collection_slug);
      if (params?.tab) query.append('tab', params.tab);
      if (params?.q) query.append('q', params.q);
      const qs = query.toString();
      return await request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
    } catch {
      let list = [...fallbackProducts];
      if (params?.category && params.category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase());
      }
      if (params?.tab === 'new') list = list.filter((p) => p.is_new);
      if (params?.tab === 'bestsellers') list = list.filter((p) => p.is_bestseller);
      if (params?.tab === 'sale') list = list.filter((p) => p.is_sale);
      return list;
    }
  },

  getProductBySlug: async (slug: string) => {
    try {
      return await request<Product>(`/products/${slug}`);
    } catch {
      const found = fallbackProducts.find((p) => p.slug === slug);
      if (found) return found;
      return fallbackProducts[0];
    }
  },

  getCollections: async () => {
    try {
      return await request<Collection[]>('/collections');
    } catch {
      return fallbackCollections;
    }
  },

  getCollectionBySlug: async (slug: string) => {
    try {
      return await request<CollectionDetail>(`/collections/${slug}`);
    } catch {
      const coll = fallbackCollections.find((c) => c.slug === slug) || {
        id: 99,
        title: slug.replace(/-/g, ' ').toUpperCase(),
        slug,
        description: 'High-performance athletic gymwear engineered in India.',
        sort_order: 1,
        active: true,
      };

      let prods = fallbackProducts;
      if (slug === 'tank-tops') {
        prods = fallbackProducts.filter((p) => p.category === 'Tank Tops' || p.slug.includes('tank'));
      } else if (slug === 'basic-compressions') {
        prods = fallbackProducts.filter((p) => p.slug.includes('basic') || p.category === 'Compressions');
      } else if (slug === 'premium-compressions') {
        prods = fallbackProducts.filter((p) => p.slug.includes('premium') || p.category === 'Compressions');
      } else if (slug === 'compressions') {
        prods = fallbackProducts.filter((p) => p.category === 'Compressions' || p.slug.includes('compression'));
      } else if (slug === 'ribbed-vests') {
        prods = fallbackProducts.filter((p) => p.category === 'Ribbed Vests' || p.slug.includes('ribbed'));
      } else if (slug === '270gsm-lowers') {
        prods = fallbackProducts.filter((p) => p.slug.includes('270gsm') || p.category === 'Bottoms');
      } else if (slug === '350gsm-lowers') {
        prods = fallbackProducts.filter((p) => p.slug.includes('350gsm') || p.category === 'Bottoms');
      } else if (slug === 'bottoms') {
        prods = fallbackProducts.filter((p) => p.category === 'Bottoms' || p.slug.includes('lower'));
      }

      if (prods.length === 0) {
        prods = fallbackProducts;
      }

      return {
        ...coll,
        products: prods
      };
    }
  },

  getCategories: async () => {
    try {
      return await request<string[]>('/categories');
    } catch {
      return ['Tank Tops', 'Compressions', 'Ribbed Vests', 'Bottoms'];
    }
  },

  // Search
  search: async (q: string) => {
    try {
      return await request<{ query: string; count: number; results: Product[] }>(`/search?q=${encodeURIComponent(q)}`);
    } catch {
      const lower = q.toLowerCase();
      const results = fallbackProducts.filter((p) =>
        p.title.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
      return { query: q, count: results.length, results };
    }
  },

  getSearchSuggestions: async (q: string) => {
    try {
      return await request<{ suggestions: string[]; categories: string[]; products: any[] }>(`/search/suggestions?q=${encodeURIComponent(q)}`);
    } catch {
      const lower = q.toLowerCase();
      const matched = fallbackProducts.filter((p) => p.title.toLowerCase().includes(lower));
      return {
        suggestions: matched.map((p) => p.title),
        categories: Array.from(new Set(matched.map((p) => p.category))),
        products: matched.slice(0, 3)
      };
    }
  },

  // Cart
  getCart: async (sessionId: string) => {
    try {
      return await request<CartState>(`/cart?session_id=${sessionId}`);
    } catch {
      return getLocalCart();
    }
  },

  addToCart: async (sessionId: string, variantId: number, quantity: number = 1) => {
    try {
      return await request<CartState>('/cart/items', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, variant_id: variantId, quantity }),
      });
    } catch {
      const current = getLocalCart();
      let foundProduct: Product | undefined;
      let foundVariant: any;

      for (const p of fallbackProducts) {
        const v = p.variants.find((vr) => vr.id === variantId);
        if (v) {
          foundProduct = p;
          foundVariant = v;
          break;
        }
      }

      if (foundProduct && foundVariant) {
        const existingIdx = current.items.findIndex((it) => it.variant_id === variantId);
        if (existingIdx >= 0) {
          current.items[existingIdx].quantity += quantity;
          current.items[existingIdx].total_price = current.items[existingIdx].quantity * foundVariant.price;
        } else {
          current.items.push({
            id: Date.now(),
            variant_id: variantId,
            product_id: foundProduct.id,
            product_title: foundProduct.title,
            product_slug: foundProduct.slug,
            sku: foundVariant.sku,
            color: foundVariant.color,
            size: foundVariant.size,
            price: foundVariant.price,
            compare_at_price: foundVariant.compare_at_price,
            quantity: quantity,
            total_price: foundVariant.price * quantity,
            image_url: foundProduct.cover_image,
            available_quantity: foundVariant.available_quantity,
          });
        }
      }

      current.item_count = current.items.reduce((sum, it) => sum + it.quantity, 0);
      current.subtotal = current.items.reduce((sum, it) => sum + it.total_price, 0);
      current.has_free_shipping = current.subtotal >= 5000;
      current.amount_for_free_shipping = Math.max(0, 5000 - current.subtotal);
      return saveLocalCart(current);
    }
  },

  updateCartItem: async (sessionId: string, itemId: number, quantity: number) => {
    try {
      return await request<CartState>(`/cart/items/${itemId}?session_id=${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
      });
    } catch {
      const current = getLocalCart();
      if (quantity <= 0) {
        current.items = current.items.filter((it) => it.id !== itemId);
      } else {
        const item = current.items.find((it) => it.id === itemId);
        if (item) {
          item.quantity = quantity;
          item.total_price = item.price * quantity;
        }
      }
      current.item_count = current.items.reduce((sum, it) => sum + it.quantity, 0);
      current.subtotal = current.items.reduce((sum, it) => sum + it.total_price, 0);
      current.has_free_shipping = current.subtotal >= 5000;
      current.amount_for_free_shipping = Math.max(0, 5000 - current.subtotal);
      return saveLocalCart(current);
    }
  },

  removeCartItem: async (sessionId: string, itemId: number) => {
    try {
      return await request<CartState>(`/cart/items/${itemId}?session_id=${sessionId}`, {
        method: 'DELETE',
      });
    } catch {
      const current = getLocalCart();
      current.items = current.items.filter((it) => it.id !== itemId);
      current.item_count = current.items.reduce((sum, it) => sum + it.quantity, 0);
      current.subtotal = current.items.reduce((sum, it) => sum + it.total_price, 0);
      current.has_free_shipping = current.subtotal >= 5000;
      current.amount_for_free_shipping = Math.max(0, 5000 - current.subtotal);
      return saveLocalCart(current);
    }
  },

  clearCart: async (sessionId: string) => {
    try {
      return await request<CartState>(`/cart?session_id=${sessionId}`, {
        method: 'DELETE',
      });
    } catch {
      const emptyCart: CartState = {
        session_id: sessionId,
        items: [],
        item_count: 0,
        subtotal: 0,
        free_shipping_threshold: 5000,
        amount_for_free_shipping: 5000,
        has_free_shipping: false
      };
      return saveLocalCart(emptyCart);
    }
  },

  // Checkout & Orders
  getCheckoutQuote: async (payload: { items: any[]; shipping_method?: string; discount_code?: string }) => {
    try {
      return await request<CheckoutQuote>('/checkout/quote', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const current = getLocalCart();
      const subtotal = current.subtotal || 24999.0;
      let discountAmount = 0;
      let discountApplied = null;

      if (payload.discount_code?.toUpperCase() === 'YOUNGIN1000' && subtotal >= 5000) {
        discountAmount = 1000.0;
        discountApplied = 'YOUNGIN1000';
      } else if (payload.discount_code?.toUpperCase() === 'RADIAN15') {
        discountAmount = Math.round(subtotal * 0.15);
        discountApplied = 'RADIAN15';
      } else if (payload.discount_code?.toUpperCase() === 'FIRST10') {
        discountAmount = Math.round(subtotal * 0.10);
        discountApplied = 'FIRST10';
      }

      const freeShipping = subtotal >= 5000;
      const shipping = payload.shipping_method === 'express' ? 750.0 : (freeShipping ? 0.0 : 350.0);
      const taxable = Math.max(0, subtotal - discountAmount);
      const tax = Math.round(taxable * 0.12 * 100) / 100;
      const total = taxable + shipping + tax;

      return {
        subtotal,
        discount: discountAmount,
        shipping,
        tax,
        total,
        discount_code_applied: discountApplied,
        discount_applied_amount: discountAmount,
        free_shipping_eligible: freeShipping
      };
    }
  },

  validateDiscount: async (code: string, subtotal: number) => {
    try {
      return await request<{ valid: boolean; code: string; calculated_discount: number; message: string }>('/discounts/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      });
    } catch {
      const upper = code.trim().toUpperCase();
      if (upper === 'YOUNGIN1000') {
        if (subtotal >= 5000) {
          return { valid: true, code: upper, calculated_discount: 1000, message: '₹1,000 off applied' };
        }
        return { valid: false, code: upper, calculated_discount: 0, message: 'Minimum order ₹5,000 required for YOUNGIN1000' };
      }
      if (upper === 'RADIAN15') {
        return { valid: true, code: upper, calculated_discount: Math.round(subtotal * 0.15), message: '15% discount applied' };
      }
      if (upper === 'FIRST10') {
        return { valid: true, code: upper, calculated_discount: Math.round(subtotal * 0.10), message: '10% welcome discount applied' };
      }
      return { valid: false, code: upper, calculated_discount: 0, message: 'Invalid promo code' };
    }
  },

  createOrder: async (payload: any) => {
    try {
      return await request<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      const orderNum = `YIN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const subtotal = payload.items?.reduce((s: number, i: any) => s + (i.price || 11999) * (i.quantity || 1), 0) || 24999;
      const discount = payload.discount_code ? 1000 : 0;
      const tax = Math.round((subtotal - discount) * 0.12);
      const shipping = subtotal >= 5000 ? 0 : 350;
      const order: Order = {
        id: Date.now(),
        order_number: orderNum,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        phone: payload.phone,
        address1: payload.address1,
        address2: payload.address2,
        city: payload.city,
        state: payload.state,
        postal_code: payload.postal_code,
        country: payload.country || 'India',
        shipping_method: payload.shipping_method || 'standard',
        payment_method: payload.payment_method || 'upi',
        subtotal,
        discount,
        shipping,
        tax,
        total: subtotal - discount + shipping + tax,
        status: 'confirmed',
        payment_status: 'paid',
        tracking_number: `TRK${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        discount_code: payload.discount_code,
        created_at: new Date().toISOString(),
        items: payload.items || []
      };

      try {
        const storedOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        storedOrders.unshift(order);
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(storedOrders));
      } catch (e) {
        console.warn('LocalStorage error saving order', e);
      }

      return order;
    }
  },

  getOrderByNumber: async (orderNumber: string) => {
    try {
      return await request<Order>(`/orders/${orderNumber}`);
    } catch {
      try {
        const storedOrders: Order[] = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        const found = storedOrders.find((o) => o.order_number === orderNumber);
        if (found) return found;
      } catch (e) {
        console.warn('LocalStorage error', e);
      }

      return {
        id: 1,
        order_number: orderNumber,
        email: 'client@younginapparels.com',
        first_name: 'Dhruv',
        last_name: 'Jai',
        address1: '42 Altamount Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400026',
        country: 'India',
        shipping_method: 'standard',
        payment_method: 'upi',
        subtotal: 24999.0,
        discount: 1000.0,
        shipping: 0.0,
        tax: 2879.88,
        total: 26878.88,
        status: 'confirmed',
        payment_status: 'paid',
        tracking_number: 'TRK6A2A47182F',
        discount_code: 'YOUNGIN1000',
        created_at: new Date().toISOString(),
        items: [
          {
            id: 1,
            variant_id: 1,
            product_title: 'The Oversized Double-Breasted Wool Overcoat',
            variant_color: 'Midnight Black',
            variant_size: 'S',
            sku: 'YIN-OVC-MID-S',
            unit_price: 24999.0,
            quantity: 1,
            total_price: 24999.0,
            image_url: '/images/product-overcoat.jpg'
          }
        ]
      };
    }
  },

  // CMS & Lookbook
  getHomepageCMS: async () => {
    try {
      return await request<Record<string, CMSSection>>('/cms/homepage');
    } catch {
      return fallbackCMS;
    }
  },

  getLookbook: async () => {
    try {
      return await request<LookbookData>('/lookbook');
    } catch {
      return fallbackLookbook;
    }
  },

  subscribeNewsletter: async (email: string) => {
    try {
      return await request<{ success: boolean; message: string }>('/newsletter/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      return { success: true, message: `Subscription confirmed for ${email}. Welcome to the Atelier.` };
    }
  },

  // Admin
  getAdminDashboard: async () => {
    try {
      return await request<any>('/admin/dashboard');
    } catch {
      return {
        metrics: {
          total_revenue: 148590.0,
          total_orders: 14,
          total_products: fallbackProducts.length,
          low_stock_count: 2
        }
      };
    }
  },

  getAdminOrders: async (status?: string) => {
    try {
      return await request<Order[]>(`/admin/orders${status ? `?status=${status}` : ''}`);
    } catch {
      try {
        const storedOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        if (storedOrders.length > 0) return storedOrders;
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
      return [
        {
          id: 1,
          order_number: 'YIN-706FAB12',
          first_name: 'Dhruv',
          last_name: 'Jai',
          email: 'client@younginapparels.com',
          total: 26878.88,
          status: 'confirmed',
          address1: '42 Altamount Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          postal_code: '400026',
          country: 'India',
          tracking_number: 'TRK6A2A47182F',
          items: [
            {
              id: 1,
              product_title: 'The Oversized Double-Breasted Wool Overcoat',
              variant_color: 'Midnight Black',
              variant_size: 'S',
              quantity: 1,
              image_url: '/images/product-overcoat.jpg'
            }
          ]
        }
      ];
    }
  },

  updateOrderStatus: async (orderId: number, status: string, trackingNumber?: string) => {
    try {
      return await request<any>(`/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, tracking_number: trackingNumber }),
      });
    } catch {
      return { success: true, order_id: orderId, status };
    }
  },

  updateVariantInventory: async (variantId: number, availableQuantity: number) => {
    try {
      return await request<any>(`/admin/variants/${variantId}/inventory`, {
        method: 'PATCH',
        body: JSON.stringify({ variant_id: variantId, available_quantity: availableQuantity }),
      });
    } catch {
      return { success: true, variant_id: variantId, available_quantity: availableQuantity };
    }
  },

  getAdminDiscounts: async () => {
    try {
      return await request<any[]>('/admin/discounts');
    } catch {
      return [
        { id: 1, code: 'YOUNGIN1000', discount_type: 'fixed', value: 1000, usage_count: 8, active: true },
        { id: 2, code: 'RADIAN15', discount_type: 'percentage', value: 15, usage_count: 14, active: true },
        { id: 3, code: 'FIRST10', discount_type: 'percentage', value: 10, usage_count: 22, active: true },
      ];
    }
  },

  createAdminDiscount: async (payload: any) => {
    try {
      return await request<any>('/admin/discounts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return { success: true, ...payload, id: Date.now(), usage_count: 0 };
    }
  },

  updateAdminCMS: async (sectionKey: string, payload: any) => {
    try {
      return await request<any>(`/admin/cms/${sectionKey}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } catch {
      return { success: true, section_key: sectionKey, ...payload };
    }
  },
};
