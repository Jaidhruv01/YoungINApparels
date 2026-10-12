export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  color: string;
  color_code: string;
  size: string;
  price: number;
  compare_at_price?: number | null;
  available_quantity: number;
  active: boolean;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string | null;
  position: number;
  variant_id?: number | null;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_summary?: string | null;
  category: string;
  price: number;
  compare_at_price?: number | null;
  details?: string | null;
  fabric_care?: string | null;
  fit_info?: string | null;
  is_new: boolean;
  is_bestseller: boolean;
  is_sale: boolean;
  is_featured: boolean;
  cover_image: string;
  hover_image?: string | null;
  active: boolean;
  created_at: string;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface Collection {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  badge?: string | null;
  sort_order: number;
  active: boolean;
  product_count?: number;
}

export interface CollectionDetail extends Collection {
  products: Product[];
}

export interface CartItemDetail {
  id: number;
  variant_id: number;
  product_id: number;
  product_title: string;
  product_slug: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  compare_at_price?: number | null;
  quantity: number;
  total_price: number;
  image_url: string;
  available_quantity: number;
}

export interface CartState {
  session_id: string;
  items: CartItemDetail[];
  item_count: number;
  subtotal: number;
  free_shipping_threshold: number;
  amount_for_free_shipping: number;
  has_free_shipping: boolean;
}

export interface LookbookHotspot {
  id: number;
  x_percent: number;
  y_percent: number;
  product_id: number;
  title: string;
  price: number;
  tag: string;
  active: boolean;
  product_slug?: string | null;
  product_image?: string | null;
}

export interface LookbookData {
  title: string;
  subtitle: string;
  image_url: string;
  hotspots: LookbookHotspot[];
}

export interface CMSSection {
  id: number;
  section_key: string;
  title?: string | null;
  subtitle?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
  image_url?: string | null;
  meta_json?: Record<string, any> | null;
  updated_at: string;
}

export interface CheckoutQuote {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  discount_code_applied?: string | null;
  discount_applied_amount: number;
  free_shipping_eligible: boolean;
}

export interface OrderItem {
  id: number;
  variant_id: number;
  product_title: string;
  variant_color: string;
  variant_size: string;
  sku: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  shipping_method: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  payment_status: string;
  tracking_number?: string | null;
  discount_code?: string | null;
  created_at: string;
  items: OrderItem[];
}
