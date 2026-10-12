import {
  Product, Collection, CollectionDetail, CartState, LookbookData,
  CMSSection, CheckoutQuote, Order
} from '../types';

const API_BASE = '/api/v1';

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

export const api = {
  // Catalog
  getProducts: (params?: { category?: string; sort_by?: string; collection_slug?: string; tab?: string; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.sort_by) query.append('sort_by', params.sort_by);
    if (params?.collection_slug) query.append('collection_slug', params.collection_slug);
    if (params?.tab) query.append('tab', params.tab);
    if (params?.q) query.append('q', params.q);
    const qs = query.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  getProductBySlug: (slug: string) => {
    return request<Product>(`/products/${slug}`);
  },

  getCollections: () => {
    return request<Collection[]>('/collections');
  },

  getCollectionBySlug: (slug: string) => {
    return request<CollectionDetail>(`/collections/${slug}`);
  },

  getCategories: () => {
    return request<string[]>('/categories');
  },

  // Search
  search: (q: string) => {
    return request<{ query: string; count: number; results: Product[] }>(`/search?q=${encodeURIComponent(q)}`);
  },

  getSearchSuggestions: (q: string) => {
    return request<{ suggestions: string[]; categories: string[]; products: any[] }>(`/search/suggestions?q=${encodeURIComponent(q)}`);
  },

  // Cart
  getCart: (sessionId: string) => {
    return request<CartState>(`/cart?session_id=${sessionId}`);
  },

  addToCart: (sessionId: string, variantId: number, quantity: number = 1) => {
    return request<CartState>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, variant_id: variantId, quantity }),
    });
  },

  updateCartItem: (sessionId: string, itemId: number, quantity: number) => {
    return request<CartState>(`/cart/items/${itemId}?session_id=${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },

  removeCartItem: (sessionId: string, itemId: number) => {
    return request<CartState>(`/cart/items/${itemId}?session_id=${sessionId}`, {
      method: 'DELETE',
    });
  },

  clearCart: (sessionId: string) => {
    return request<CartState>(`/cart?session_id=${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Checkout & Orders
  getCheckoutQuote: (payload: { items: any[]; shipping_method?: string; discount_code?: string }) => {
    return request<CheckoutQuote>('/checkout/quote', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  validateDiscount: (code: string, subtotal: number) => {
    return request<{ valid: boolean; code: string; calculated_discount: number; message: string }>('/discounts/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  createOrder: (payload: any) => {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getOrderByNumber: (orderNumber: string) => {
    return request<Order>(`/orders/${orderNumber}`);
  },

  // CMS & Lookbook
  getHomepageCMS: () => {
    return request<Record<string, CMSSection>>('/cms/homepage');
  },

  getLookbook: () => {
    return request<LookbookData>('/lookbook');
  },

  subscribeNewsletter: (email: string) => {
    return request<{ success: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Admin
  getAdminDashboard: () => {
    return request<any>('/admin/dashboard');
  },

  getAdminOrders: (status?: string) => {
    return request<Order[]>(`/admin/orders${status ? `?status=${status}` : ''}`);
  },

  updateOrderStatus: (orderId: number, status: string, trackingNumber?: string) => {
    return request<any>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, tracking_number: trackingNumber }),
    });
  },

  updateVariantInventory: (variantId: number, availableQuantity: number) => {
    return request<any>(`/admin/variants/${variantId}/inventory`, {
      method: 'PATCH',
      body: JSON.stringify({ variant_id: variantId, available_quantity: availableQuantity }),
    });
  },

  getAdminDiscounts: () => {
    return request<any[]>('/admin/discounts');
  },

  createAdminDiscount: (payload: any) => {
    return request<any>('/admin/discounts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateAdminCMS: (sectionKey: string, payload: any) => {
    return request<any>(`/admin/cms/${sectionKey}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
