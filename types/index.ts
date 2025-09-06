
// ===== User & Auth Types =====
export type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN';
export type SellerStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  sellerStatus: SellerStatus;
  storeId?: string;
}

// ===== Store Types =====
export type StoreStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StoreApplication {
  storeId: string;
  userId: string;
  storeName: string;
  storeDescription: string;
  status: StoreStatus;
  submittedAt: string;
  bannerImageUrl?: string;
  profileImageUrl?: string;
  themeColor?: string;
}

// ===== Product & Cart Types =====
export interface Product {
  id: number;
  storeId: string;
  name: string;
  name_th: string;
  price: number;
  imageUrl: string;
  description: string;
}

export type ProductInput = Omit<Product, 'id'>;

export interface CartItem {
  product: Product;
  quantity: number;
}

// ===== Order Types =====
export type OrderItemStatus = 'Processing' | 'Shipped' | 'Delivered';

export interface OrderItem extends CartItem {
  status: OrderItemStatus;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  total: number;
}

// ===== Review Types =====
export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AddReviewData {
    productId: number;
    rating: number;
    comment: string;
}

// ===== Logging Types =====
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';
export type LogSource = 'Auth' | 'Product' | 'Order' | 'Store' | 'General';

export interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
}

export interface LogEvent {
    level: LogLevel;
    source: LogSource;
    message: string;
}
