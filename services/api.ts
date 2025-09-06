import { DATA_SOURCE } from '../config';
import { 
    Product, ProductInput, 
    Order, CartItem, OrderItemStatus, 
    User, UserRole, SellerStatus, 
    StoreApplication, StoreStatus,
    Review, AddReviewData,
    LogEntry, LogEvent
} from '../types';

// ======================================================================
// Mock Data Initialization
// ======================================================================

const MOCK_PRODUCTS: Product[] = [
  { id: 1, storeId: 'STORE-MOCK-123', name: 'Organic Whey Protein', name_th: 'เวย์โปรตีน ออร์แกนิค', price: 1890, imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdb340?q=80', description: 'Build lean muscle with our clean, 100% grass-fed whey protein. It\'s packed with 25g of protein per serving, low in sugar, and free from artificial sweeteners.' },
  { id: 2, storeId: 'STORE-MOCK-123', name: 'Men\'s Daily Multivitamin', name_th: 'วิตามินรวมสำหรับผู้ชาย', price: 850, imageUrl: 'https://images.unsplash.com/photo-1607620839355-7e17d7b34a17?q=80', description: 'A complete daily multivitamin complex designed specifically for men. Supports energy levels, immune health, and muscle function.' },
  { id: 3, storeId: 'STORE-MOCK-123', name: 'Cold Brew Coffee Beans', name_th: 'เมล็ดกาแฟสกัดเย็น', price: 450, imageUrl: 'https://images.unsplash.com/photo-1599160539162-4b6a827c1f8a?q=80', description: 'Specially selected Arabica beans, coarse-ground for a rich, smooth, and low-acid cold brew.' },
  { id: 4, storeId: 'STORE-MOCK-123', name: 'Keto Protein Bars', name_th: 'โปรตีนบาร์ คีโต', price: 120, imageUrl: 'https://images.unsplash.com/photo-1557844352-761f2565b576?q=80', description: 'The perfect on-the-go snack for a ketogenic lifestyle. Low in net carbs, high in healthy fats and protein.' },
  { id: 5, storeId: 'STORE-MOCK-123', name: 'Organic Green Tea', name_th: 'ชาเขียวออร์แกนิค', price: 320, imageUrl: 'https://images.unsplash.com/photo-1627435601361-ec25f2b74c20?q=80', description: 'Premium, hand-picked organic green tea leaves. Rich in antioxidants like EGCG, it helps boost metabolism.' },
  { id: 6, storeId: 'STORE-MOCK-123', name: 'Trail Mix Nuts & Seeds', name_th: 'ถั่วและเมล็ดพืชรวม', price: 250, imageUrl: 'https://images.unsplash.com/photo-1610422343103-6670b036a13d?q=80', description: 'A satisfying and heart-healthy blend of raw almonds, walnuts, pumpkin seeds, and sunflower seeds.' },
];

const MOCK_USERS: User[] = [
    { id: 'user-1678886400001', email: 'seller.approved@example.com', role: 'SELLER', sellerStatus: 'APPROVED', storeId: 'STORE-MOCK-123' },
    { id: 'user-1678886400002', email: 'seller.pending@example.com', role: 'CUSTOMER', sellerStatus: 'PENDING', storeId: 'STORE-PENDING-456'},
    { id: 'user-1678886400003', email: 'customer@example.com', role: 'CUSTOMER', sellerStatus: 'NONE' },
    { id: 'ADMIN-USER-001', email: 'admin@example.com', role: 'ADMIN', sellerStatus: 'NONE' },
];

const MOCK_STORES: StoreApplication[] = [
    { storeId: "STORE-MOCK-123", userId: "user-1678886400001", storeName: "Healthy Habits Co.", storeDescription: "Your one-stop shop for organic and healthy products.", status: "APPROVED", submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), bannerImageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920", profileImageUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Healthy%20Habits", themeColor: "#10B981" },
    { storeId: "STORE-PENDING-456", userId: "user-1678886400002", storeName: "Green Goodness", storeDescription: "Selling fresh organic produce.", status: "PENDING", submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), bannerImageUrl: "https://images.unsplash.com/photo-1516214124259-011a8a287136?q=80&w=1920", profileImageUrl: "https://api.dicebear.com/8.x/initials/svg?seed=Green%20Goodness", themeColor: "#34D399" }
];

const MOCK_REVIEWS: Review[] = [
    { id: 'rev-1', productId: 1, userId: 'user-1678886400003', userName: 'customer@example.com', rating: 5, comment: "This is the best whey protein I've ever used! Mixes well and tastes great.", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'rev-2', productId: 1, userId: 'user-1678886400004', userName: 'jane.doe@example.com', rating: 4, comment: "Good quality protein, but a little on the sweet side for me. Still, a solid product.", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
];

// ======================================================================
// Local Storage Helper Functions
// ======================================================================

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        }
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const saveToStorage = <T>(key: string, value: T): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

// ======================================================================
// API Service Definition
// ======================================================================
// This is the central gateway for all data operations.
// It uses the DATA_SOURCE config to decide whether to use local storage
// or make a real API call.

// --- Product Service ---

export const getProducts = async (): Promise<Product[]> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        return getFromStorage<Product[]>('blife_products', MOCK_PRODUCTS);
    } else {
        // --- PRODUCTION CODE ---
        // Replace this with a fetch call to your backend API.
        // Example:
        // const response = await fetch('/api/products');
        // return await response.json();
        console.warn("API mode: getProducts() is not implemented.");
        return [];
    }
};

export const addProduct = async (productData: ProductInput): Promise<Product> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const products = await getProducts();
        const newProduct: Product = { ...productData, id: Date.now() };
        saveToStorage('blife_products', [...products, newProduct]);
        return newProduct;
    } else {
        console.warn("API mode: addProduct() is not implemented.");
        // @ts-ignore
        return { ...productData, id: Date.now() };
    }
};

// ... Implement updateProduct and deleteProduct similarly

// --- Order Service ---

export const getOrders = async (): Promise<Order[]> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        return getFromStorage<Order[]>('blife_orders', []);
    } else {
        console.warn("API mode: getOrders() is not implemented.");
        return [];
    }
};

export const createOrder = async (items: CartItem[], userId: string): Promise<Order> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const orders = await getOrders();
        const newOrder: Order = {
          id: `BLIFE-${Date.now()}`,
          userId,
          date: new Date().toISOString(),
          items: items.map(item => ({ ...item, status: 'Processing' })),
          total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        };
        saveToStorage('blife_orders', [...orders, newOrder]);
        return newOrder;
    } else {
        console.warn("API mode: createOrder() is not implemented.");
        // @ts-ignore
        return {};
    }
};

export const updateOrderItemStatus = async (orderId: string, productId: number, status: OrderItemStatus): Promise<Order> => {
     if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const orders = await getOrders();
        let updatedOrder: Order | undefined;
        const newOrders = orders.map(order => {
            if (order.id !== orderId) return order;
            const updatedItems = order.items.map(item => 
                item.product.id === productId ? { ...item, status } : item
            );
            updatedOrder = { ...order, items: updatedItems };
            return updatedOrder;
        });
        saveToStorage('blife_orders', newOrders);
        return updatedOrder!;
    } else {
        console.warn("API mode: updateOrderItemStatus() is not implemented.");
        // @ts-ignore
        return {};
    }
}


// --- User & Store Services ---

export const getUsers = async (): Promise<User[]> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        return getFromStorage<User[]>('blife_users', MOCK_USERS);
    } else {
        console.warn("API mode: getUsers() is not implemented.");
        return [];
    }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const users = await getUsers();
        let updatedUser: User | undefined;
        const newUsers = users.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, ...updates };
                return updatedUser;
            }
            return u;
        });
        saveToStorage('blife_users', newUsers);
        return updatedUser!;
    } else {
        console.warn("API mode: updateUser() is not implemented.");
        // @ts-ignore
        return {};
    }
};

export const getStoreApplications = async (): Promise<StoreApplication[]> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        return getFromStorage<StoreApplication[]>('blife_stores', MOCK_STORES);
    } else {
        console.warn("API mode: getStoreApplications() is not implemented.");
        return [];
    }
};

export const createStoreApplication = async (userId: string, storeName: string, storeDescription: string): Promise<StoreApplication> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const stores = await getStoreApplications();
        const newApp: StoreApplication = {
            storeId: `STORE-${Date.now()}`,
            userId, storeName, storeDescription,
            status: 'PENDING',
            submittedAt: new Date().toISOString(),
            bannerImageUrl: 'https://images.unsplash.com/photo-1516214124259-011a8a287136?q=80&w=1920',
            profileImageUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(storeName)}`,
            themeColor: '#34D399'
        };
        saveToStorage('blife_stores', [...stores.filter(s => s.userId !== userId), newApp]);
        return newApp;
    } else {
        console.warn("API mode: createStoreApplication() is not implemented.");
        // @ts-ignore
        return {};
    }
};

export const updateStoreApplicationStatus = async (storeId: string, status: StoreStatus): Promise<StoreApplication> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const stores = await getStoreApplications();
        let updatedStore: StoreApplication | undefined;
        const newStores = stores.map(s => {
            if (s.storeId === storeId) {
                updatedStore = { ...s, status };
                return updatedStore;
            }
            return s;
        });
        saveToStorage('blife_stores', newStores);
        return updatedStore!;
    } else {
        console.warn("API mode: updateStoreApplicationStatus() is not implemented.");
        // @ts-ignore
        return {};
    }
};

export const updateStoreCustomization = async (storeId: string, updates: Partial<StoreApplication>): Promise<StoreApplication> => {
     if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const stores = await getStoreApplications();
        let updatedStore: StoreApplication | undefined;
        const newStores = stores.map(s => {
            if (s.storeId === storeId) {
                updatedStore = { ...s, ...updates };
                return updatedStore;
            }
            return s;
        });
        saveToStorage('blife_stores', newStores);
        return updatedStore!;
    } else {
        console.warn("API mode: updateStoreCustomization() is not implemented.");
        // @ts-ignore
        return {};
    }
};

// --- Review Service ---

export const getReviews = async (): Promise<Review[]> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        return getFromStorage<Review[]>('blife_reviews', MOCK_REVIEWS);
    } else {
        console.warn("API mode: getReviews() is not implemented.");
        return [];
    }
};

export const addReview = async (reviewData: AddReviewData, user: User): Promise<Review> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const reviews = await getReviews();
        const newReview: Review = {
            id: `rev-${Date.now()}`,
            date: new Date().toISOString(),
            userId: user.id,
            userName: user.email,
            ...reviewData
        };
        saveToStorage('blife_reviews', [newReview, ...reviews]);
        return newReview;
    } else {
        console.warn("API mode: addReview() is not implemented.");
        // @ts-ignore
        return {};
    }
};


// --- Log Service ---

export const getLogs = async (): Promise<LogEntry[]> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        return getFromStorage<LogEntry[]>('blife_logs', []);
    } else {
        console.warn("API mode: getLogs() is not implemented.");
        return [];
    }
};

export const logEvent = async (event: LogEvent): Promise<LogEntry> => {
    if (DATA_SOURCE === 'LOCAL_STORAGE') {
        const logs = await getLogs();
        const newLog: LogEntry = {
            ...event,
            id: Date.now(),
            timestamp: new Date().toISOString()
        };
        saveToStorage('blife_logs', [newLog, ...logs]);
        return newLog;
    } else {
        console.warn("API mode: logEvent() is not implemented.");
         // In API mode, you might send this to a logging service like Sentry or Datadog
        // For now, just log to console.
        console.log(`[LOG - ${event.level}] (${event.source}): ${event.message}`);
        // @ts-ignore
        return {};
    }
};
