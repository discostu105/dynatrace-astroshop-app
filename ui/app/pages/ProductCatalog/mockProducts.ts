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
    unitPrice: 7999, // $79.99
    stockCount: 145,
    available: true,
    imageEmoji: '🎧',
  },
  {
    productId: 'PROD-002',
    name: 'Smartphone 12 Pro',
    category: 'Electronics',
    unitPrice: 99999, // $999.99
    stockCount: 32,
    available: true,
    imageEmoji: '📱',
  },
  {
    productId: 'PROD-003',
    name: 'USB-C Charging Cable',
    category: 'Electronics',
    unitPrice: 1499, // $14.99
    stockCount: 0,
    available: false,
    imageEmoji: '🔌',
  },
  {
    productId: 'PROD-004',
    name: '4K Webcam',
    category: 'Electronics',
    unitPrice: 12999, // $129.99
    stockCount: 67,
    available: true,
    imageEmoji: '📹',
  },
  {
    productId: 'PROD-005',
    name: 'Portable SSD 1TB',
    category: 'Electronics',
    unitPrice: 14999, // $149.99
    stockCount: 89,
    available: true,
    imageEmoji: '💾',
  },

  // Apparel
  {
    productId: 'PROD-006',
    name: 'Cotton T-Shirt',
    category: 'Apparel',
    unitPrice: 1999, // $19.99
    stockCount: 234,
    available: true,
    imageEmoji: '👕',
  },
  {
    productId: 'PROD-007',
    name: 'Running Sneakers',
    category: 'Apparel',
    unitPrice: 8999, // $89.99
    stockCount: 78,
    available: true,
    imageEmoji: '👟',
  },
  {
    productId: 'PROD-008',
    name: 'Winter Jacket',
    category: 'Apparel',
    unitPrice: 12999, // $129.99
    stockCount: 0,
    available: false,
    imageEmoji: '🧥',
  },
  {
    productId: 'PROD-009',
    name: 'Baseball Cap',
    category: 'Apparel',
    unitPrice: 2499, // $24.99
    stockCount: 156,
    available: true,
    imageEmoji: '🧢',
  },
  {
    productId: 'PROD-010',
    name: 'Leather Belt',
    category: 'Apparel',
    unitPrice: 3499, // $34.99
    stockCount: 102,
    available: true,
    imageEmoji: '👔',
  },

  // Books
  {
    productId: 'PROD-011',
    name: 'The Great Adventure',
    category: 'Books',
    unitPrice: 1699, // $16.99
    stockCount: 45,
    available: true,
    imageEmoji: '📚',
  },
  {
    productId: 'PROD-012',
    name: 'Coding for Beginners',
    category: 'Books',
    unitPrice: 2999, // $29.99
    stockCount: 123,
    available: true,
    imageEmoji: '📖',
  },
  {
    productId: 'PROD-013',
    name: 'Mystery at Midnight',
    category: 'Books',
    unitPrice: 1299, // $12.99
    stockCount: 0,
    available: false,
    imageEmoji: '📕',
  },
  {
    productId: 'PROD-014',
    name: 'The Art of Design',
    category: 'Books',
    unitPrice: 3999, // $39.99
    stockCount: 67,
    available: true,
    imageEmoji: '📘',
  },
  {
    productId: 'PROD-015',
    name: 'Science Fiction Anthology',
    category: 'Books',
    unitPrice: 2299, // $22.99
    stockCount: 91,
    available: true,
    imageEmoji: '📙',
  },

  // Home
  {
    productId: 'PROD-016',
    name: 'Ceramic Coffee Mug',
    category: 'Home',
    unitPrice: 1299, // $12.99
    stockCount: 289,
    available: true,
    imageEmoji: '☕',
  },
  {
    productId: 'PROD-017',
    name: 'Stainless Steel Blender',
    category: 'Home',
    unitPrice: 5999, // $59.99
    stockCount: 54,
    available: true,
    imageEmoji: '🍹',
  },
  {
    productId: 'PROD-018',
    name: 'Memory Foam Pillow',
    category: 'Home',
    unitPrice: 3499, // $34.99
    stockCount: 0,
    available: false,
    imageEmoji: '🛏️',
  },
  {
    productId: 'PROD-019',
    name: 'LED Desk Lamp',
    category: 'Home',
    unitPrice: 4599, // $45.99
    stockCount: 112,
    available: true,
    imageEmoji: '💡',
  },
  {
    productId: 'PROD-020',
    name: 'Wall Clock',
    category: 'Home',
    unitPrice: 2799, // $27.99
    stockCount: 145,
    available: true,
    imageEmoji: '🕐',
  },

  // Sports
  {
    productId: 'PROD-021',
    name: 'Yoga Mat',
    category: 'Sports',
    unitPrice: 2999, // $29.99
    stockCount: 178,
    available: true,
    imageEmoji: '🧘',
  },
  {
    productId: 'PROD-022',
    name: 'Basketball',
    category: 'Sports',
    unitPrice: 3499, // $34.99
    stockCount: 98,
    available: true,
    imageEmoji: '🏀',
  },
  {
    productId: 'PROD-023',
    name: 'Tennis Racket',
    category: 'Sports',
    unitPrice: 8999, // $89.99
    stockCount: 0,
    available: false,
    imageEmoji: '🎾',
  },
  {
    productId: 'PROD-024',
    name: 'Resistance Bands Set',
    category: 'Sports',
    unitPrice: 1999, // $19.99
    stockCount: 234,
    available: true,
    imageEmoji: '💪',
  },
];
