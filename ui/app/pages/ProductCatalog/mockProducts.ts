export type Product = {
  productId: string;
  name: string;
  category: 'Electronics' | 'Apparel' | 'Books' | 'Home' | 'Sports';
  unitPrice: number; // USD cents
  stockCount: number;
  available: boolean;
  imageEmoji: string;
};

export const mockProducts: Product[] = [
  // Electronics
  {
    productId: 'PROD-001',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    unitPrice: 7999,
    stockCount: 145,
    available: true,
    imageEmoji: '🎧',
  },
  {
    productId: 'PROD-002',
    name: 'Smartphone Pro 15',
    category: 'Electronics',
    unitPrice: 89999,
    stockCount: 0,
    available: false,
    imageEmoji: '📱',
  },
  {
    productId: 'PROD-003',
    name: 'USB-C Charging Cable',
    category: 'Electronics',
    unitPrice: 1299,
    stockCount: 423,
    available: true,
    imageEmoji: '🔌',
  },
  {
    productId: 'PROD-004',
    name: 'Laptop Stand Aluminum',
    category: 'Electronics',
    unitPrice: 4999,
    stockCount: 78,
    available: true,
    imageEmoji: '💻',
  },
  {
    productId: 'PROD-005',
    name: 'Wireless Mouse',
    category: 'Electronics',
    unitPrice: 2999,
    stockCount: 0,
    available: false,
    imageEmoji: '🖱️',
  },

  // Apparel
  {
    productId: 'PROD-006',
    name: 'Classic Cotton T-Shirt',
    category: 'Apparel',
    unitPrice: 1999,
    stockCount: 256,
    available: true,
    imageEmoji: '👕',
  },
  {
    productId: 'PROD-007',
    name: 'Denim Jeans Slim Fit',
    category: 'Apparel',
    unitPrice: 5999,
    stockCount: 112,
    available: true,
    imageEmoji: '👖',
  },
  {
    productId: 'PROD-008',
    name: 'Running Sneakers',
    category: 'Apparel',
    unitPrice: 8999,
    stockCount: 0,
    available: false,
    imageEmoji: '👟',
  },
  {
    productId: 'PROD-009',
    name: 'Winter Jacket Waterproof',
    category: 'Apparel',
    unitPrice: 12999,
    stockCount: 45,
    available: true,
    imageEmoji: '🧥',
  },
  {
    productId: 'PROD-010',
    name: 'Baseball Cap',
    category: 'Apparel',
    unitPrice: 1799,
    stockCount: 189,
    available: true,
    imageEmoji: '🧢',
  },

  // Books
  {
    productId: 'PROD-011',
    name: 'The Art of Programming',
    category: 'Books',
    unitPrice: 3999,
    stockCount: 67,
    available: true,
    imageEmoji: '📚',
  },
  {
    productId: 'PROD-012',
    name: 'Mystery Novel: Dark Secrets',
    category: 'Books',
    unitPrice: 1499,
    stockCount: 203,
    available: true,
    imageEmoji: '📖',
  },
  {
    productId: 'PROD-013',
    name: 'Cookbook: Healthy Meals',
    category: 'Books',
    unitPrice: 2799,
    stockCount: 0,
    available: false,
    imageEmoji: '📕',
  },
  {
    productId: 'PROD-014',
    name: 'Travel Guide: Europe',
    category: 'Books',
    unitPrice: 2499,
    stockCount: 134,
    available: true,
    imageEmoji: '🗺️',
  },

  // Home
  {
    productId: 'PROD-015',
    name: 'Stainless Steel Coffee Maker',
    category: 'Home',
    unitPrice: 6999,
    stockCount: 92,
    available: true,
    imageEmoji: '☕',
  },
  {
    productId: 'PROD-016',
    name: 'Decorative Table Lamp',
    category: 'Home',
    unitPrice: 4599,
    stockCount: 0,
    available: false,
    imageEmoji: '💡',
  },
  {
    productId: 'PROD-017',
    name: 'Memory Foam Pillow',
    category: 'Home',
    unitPrice: 3499,
    stockCount: 178,
    available: true,
    imageEmoji: '🛏️',
  },
  {
    productId: 'PROD-018',
    name: 'Kitchen Knife Set',
    category: 'Home',
    unitPrice: 7999,
    stockCount: 56,
    available: true,
    imageEmoji: '🔪',
  },

  // Sports
  {
    productId: 'PROD-019',
    name: 'Yoga Mat Premium',
    category: 'Sports',
    unitPrice: 3999,
    stockCount: 245,
    available: true,
    imageEmoji: '🧘',
  },
  {
    productId: 'PROD-020',
    name: 'Basketball Official Size',
    category: 'Sports',
    unitPrice: 2999,
    stockCount: 0,
    available: false,
    imageEmoji: '🏀',
  },
  {
    productId: 'PROD-021',
    name: 'Resistance Bands Set',
    category: 'Sports',
    unitPrice: 1999,
    stockCount: 312,
    available: true,
    imageEmoji: '🏋️',
  },
  {
    productId: 'PROD-022',
    name: 'Water Bottle Insulated',
    category: 'Sports',
    unitPrice: 2499,
    stockCount: 167,
    available: true,
    imageEmoji: '💧',
  },
];
