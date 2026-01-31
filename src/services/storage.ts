import type { Product, Order, CartItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const PRODUCTS_KEY = 'purefood_products';
const ORDERS_KEY = 'purefood_orders';
const CART_KEY = 'purefood_cart';
const ADMIN_KEY = 'purefood_admin';

// Initialize default admin
export const initializeAdmin = (): void => {
  if (isLocalStorageAvailable()) {
    const admin = localStorage.getItem(ADMIN_KEY);
    if (!admin) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify({
        username: 'admin',
        password: 'admin123'
      }));
    }
  }
};

// Product Services
export const getProducts = (): Product[] => {
  if (isLocalStorageAvailable()) {
    const products = localStorage.getItem(PRODUCTS_KEY);
    const parsed = products ? JSON.parse(products) : [];
    if (parsed.length > 0) return parsed;
  }
  // Return in-memory products or sample data
  if (memoryProducts.length > 0) return memoryProducts;
  return getSampleProducts();
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = isLocalStorageAvailable() 
    ? JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
    : memoryProducts;
  
  const newProduct: Product = {
    ...product,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } else {
    memoryProducts = products;
  }
  
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products: Product[] = isLocalStorageAvailable() 
    ? JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
    : memoryProducts;
  
  const index = products.findIndex((p: Product) => p.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } else {
    memoryProducts = products;
  }
  
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products: Product[] = isLocalStorageAvailable() 
    ? JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]')
    : memoryProducts;
  
  const filtered = products.filter((p: Product) => p.id !== id);
  if (filtered.length === products.length) return false;
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  } else {
    memoryProducts = filtered;
  }
  
  return true;
};

// Order Services
export const getOrders = (): Order[] => {
  if (isLocalStorageAvailable()) {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  }
  return memoryOrders;
};

export const getOrderById = (id: string): Order | undefined => {
  const orders = getOrders();
  return orders.find((o: Order) => o.id === id);
};

export const createOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
  const orders = isLocalStorageAvailable()
    ? JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    : memoryOrders;
  
  const newOrder: Order = {
    ...order,
    id: uuidv4(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } else {
    memoryOrders = orders;
  }
  
  return newOrder;
};

export const updateOrderStatus = (id: string, status: Order['status']): Order | null => {
  const orders: Order[] = isLocalStorageAvailable()
    ? JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    : memoryOrders;
  
  const index = orders.findIndex((o: Order) => o.id === id);
  if (index === -1) return null;
  
  orders[index].status = status;
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } else {
    memoryOrders = orders;
  }
  
  return orders[index];
};

export const deleteOrder = (id: string): boolean => {
  const orders: Order[] = isLocalStorageAvailable()
    ? JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]')
    : memoryOrders;
  
  const filtered = orders.filter((o: Order) => o.id !== id);
  if (filtered.length === orders.length) return false;
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filtered));
  } else {
    memoryOrders = filtered;
  }
  
  return true;
};

// Cart Services
let memoryCart: CartItem[] = [];

export const getCart = (): CartItem[] => {
  if (isLocalStorageAvailable()) {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }
  return memoryCart;
};

export const addToCart = (product: Product, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } else {
    memoryCart = cart;
  }
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const filtered = cart.filter(item => item.product.id !== productId);
  
  if (isLocalStorageAvailable()) {
    localStorage.setItem(CART_KEY, JSON.stringify(filtered));
  } else {
    memoryCart = filtered;
  }
};

export const updateCartQuantity = (productId: string, quantity: number): void => {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
    if (isLocalStorageAvailable()) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } else {
      memoryCart = cart;
    }
  }
};

export const clearCart = (): void => {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(CART_KEY);
  } else {
    memoryCart = [];
  }
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Admin Services
let memoryAdmin = { username: 'admin', password: 'admin123' };

export const verifyAdmin = (username: string, password: string): boolean => {
  if (isLocalStorageAvailable()) {
    const admin = localStorage.getItem(ADMIN_KEY);
    if (!admin) return false;
    const adminData = JSON.parse(admin);
    return adminData.username === username && adminData.password === password;
  }
  return memoryAdmin.username === username && memoryAdmin.password === password;
};

// Sales Statistics
export const getSalesStats = () => {
  const orders = getOrders();
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  return {
    totalOrders: orders.length,
    totalSales: completedOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: completedOrders.length,
    recentOrders: orders.slice(-10).reverse()
  };
};

// Sample products data
const sampleProductsData: Omit<Product, 'id' | 'createdAt'>[] = [
  {
    name: 'Organic Rice',
    description: 'Premium quality organic rice, 5kg pack',
    price: 450,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    category: 'Rice & Grains',
    stock: 50
  },
  {
    name: 'Pure Honey',
    description: '100% pure natural honey, 500g',
    price: 350,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    category: 'Honey & Sweeteners',
    stock: 30
  },
  {
    name: 'Fresh Milk',
    description: 'Farm fresh milk, 1 liter',
    price: 80,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    category: 'Dairy',
    stock: 100
  },
  {
    name: 'Organic Eggs',
    description: 'Farm fresh organic eggs, dozen',
    price: 150,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    category: 'Dairy',
    stock: 40
  },
  {
    name: 'Mustard Oil',
    description: 'Pure mustard oil, 1 liter',
    price: 220,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    category: 'Cooking Oil',
    stock: 25
  },
  {
    name: 'Mixed Spices',
    description: 'Assorted spices pack, 500g',
    price: 280,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    category: 'Spices',
    stock: 35
  }
];

// In-memory fallback for when localStorage is not available
let memoryProducts: Product[] = [];
let memoryOrders: Order[] = [];
let isInitialized = false;

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Initialize with sample data
export const initializeSampleData = (): void => {
  if (isInitialized) return;
  
  const products = getProducts();
  if (products.length === 0) {
    sampleProductsData.forEach(product => addProduct(product));
  }
  
  isInitialized = true;
};

// Get sample products (for initial render fallback)
export const getSampleProducts = (): Product[] => {
  return sampleProductsData.map((p, i) => ({
    ...p,
    id: `sample-${i}`,
    createdAt: new Date().toISOString()
  }));
};
