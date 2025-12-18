export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  price: number;
  salePrice: number | null;
  currentPrice: number;
  onSale: boolean;
  sku: string;
  stockQuantity: number;
  active: boolean;
  featured: boolean;
  brand: string;
  material: string;
  categoryId: number;
  categoryName: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductImage {
  id: number;
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  colorCode: string;
  sku: string;
  stockQuantity: number;
  additionalPrice: number | null;
  active: boolean;
  available: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageUrl: string;
  active: boolean;
  parentId: number | null;
  parentName: string | null;
  subcategories: Category[];
  productCount: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  imageUrl: string;
  variantId: number | null;
  size: string | null;
  color: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  maxQuantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  subtotal: number;
  totalItems: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: 'CUSTOMER' | 'ADMIN';
  active: boolean;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  role: 'CUSTOMER' | 'ADMIN';
  addresses?: Address[];
}

export interface Address {
  id?: number;
  recipientName: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  phone: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  size: string | null;
  color: string | null;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  trackingCode: string | null;
  notes: string | null;
  paymentUrl: string | null;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';
export type PaymentStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REFUNDED'
  | 'CANCELLED';
export type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BOLETO';

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
