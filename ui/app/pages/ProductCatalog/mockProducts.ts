export type Product = {
  productId: string;
  name: string;
  category: 'Electronics' | 'Apparel' | 'Books' | 'Home' | 'Sports';
  unitPrice: number; // USD cents (e.g., 7999 = $79.99)
  stockCount: number;
  available: boolean;
  imageEmoji: string;
};

/**
 * Mock product data for the catalog.
 * Prices are stored in cents to avoid floating-point precision issues.
 * Product IDs follow the format PROD-XXX where XXX is a zero-padded sequential number.
 */
export const mockProducts: Product[] = [
  // Electronics
  { productId: 'PROD-001', name: 'Wireless Headphones', category: 'Electronics', unitPrice: 7999, stockCount: 42, available: true, imageEmoji: '🎧' },
  { productId: 'PROD-002', name: 'Smartphone Pro', category: 'Electronics', unitPrice: 89999, stockCount: 15, available: true, imageEmoji: '📱' },
  { productId: 'PROD-003', name: 'Laptop 15 inch', category: 'Electronics', unitPrice: 119999, stockCount: 8, available: true, imageEmoji: '💻' },
  { productId: 'PROD-004', name: 'Smart Watch', category: 'Electronics', unitPrice: 29999, stockCount: 0, available: false, imageEmoji: '⌚' },
  { productId: 'PROD-005', name: '4K Monitor', category: 'Electronics', unitPrice: 45999, stockCount: 22, available: true, imageEmoji: '🖥️' },
  
  // Apparel
  { productId: 'PROD-006', name: 'Cotton T-Shirt', category: 'Apparel', unitPrice: 1999, stockCount: 150, available: true, imageEmoji: '👕' },
  { productId: 'PROD-007', name: 'Denim Jeans', category: 'Apparel', unitPrice: 4999, stockCount: 75, available: true, imageEmoji: '👖' },
  { productId: 'PROD-008', name: 'Running Shoes', category: 'Apparel', unitPrice: 8999, stockCount: 0, available: false, imageEmoji: '👟' },
  { productId: 'PROD-009', name: 'Winter Jacket', category: 'Apparel', unitPrice: 12999, stockCount: 30, available: true, imageEmoji: '🧥' },
  { productId: 'PROD-010', name: 'Baseball Cap', category: 'Apparel', unitPrice: 1499, stockCount: 200, available: true, imageEmoji: '🧢' },
  
  // Books
  { productId: 'PROD-011', name: 'JavaScript Complete Guide', category: 'Books', unitPrice: 4499, stockCount: 50, available: true, imageEmoji: '📘' },
  { productId: 'PROD-012', name: 'Mystery Novel Collection', category: 'Books', unitPrice: 2999, stockCount: 35, available: true, imageEmoji: '📚' },
  { productId: 'PROD-013', name: 'Cooking Masterclass', category: 'Books', unitPrice: 3499, stockCount: 0, available: false, imageEmoji: '📖' },
  { productId: 'PROD-014', name: 'Science Fiction Epic', category: 'Books', unitPrice: 2499, stockCount: 100, available: true, imageEmoji: '📕' },
  { productId: 'PROD-015', name: 'History of Art', category: 'Books', unitPrice: 5999, stockCount: 18, available: true, imageEmoji: '📙' },
  
  // Home
  { productId: 'PROD-016', name: 'Desk Lamp', category: 'Home', unitPrice: 3999, stockCount: 60, available: true, imageEmoji: '💡' },
  { productId: 'PROD-017', name: 'Coffee Maker', category: 'Home', unitPrice: 7999, stockCount: 25, available: true, imageEmoji: '☕' },
  { productId: 'PROD-018', name: 'Bed Sheets Set', category: 'Home', unitPrice: 4999, stockCount: 0, available: false, imageEmoji: '🛏️' },
  { productId: 'PROD-019', name: 'Wall Clock', category: 'Home', unitPrice: 2499, stockCount: 90, available: true, imageEmoji: '🕐' },
  { productId: 'PROD-020', name: 'Indoor Plant', category: 'Home', unitPrice: 1999, stockCount: 120, available: true, imageEmoji: '🪴' },
  
  // Sports
  { productId: 'PROD-021', name: 'Yoga Mat', category: 'Sports', unitPrice: 2999, stockCount: 80, available: true, imageEmoji: '🧘' },
  { productId: 'PROD-022', name: 'Basketball', category: 'Sports', unitPrice: 3499, stockCount: 45, available: true, imageEmoji: '🏀' },
  { productId: 'PROD-023', name: 'Tennis Racket', category: 'Sports', unitPrice: 8999, stockCount: 0, available: false, imageEmoji: '🎾' },
  { productId: 'PROD-024', name: 'Dumbbells Set', category: 'Sports', unitPrice: 5999, stockCount: 28, available: true, imageEmoji: '🏋️' },
  { productId: 'PROD-025', name: 'Bicycle Helmet', category: 'Sports', unitPrice: 4499, stockCount: 55, available: true, imageEmoji: '🚴' },
];
