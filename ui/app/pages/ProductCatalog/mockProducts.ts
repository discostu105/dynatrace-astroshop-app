export type Product = {
  productId: string;
  name: string;
  category: "Electronics" | "Apparel" | "Books" | "Home" | "Sports";
  unitPrice: number; // USD cents
  stockCount: number;
  available: boolean;
  imageEmoji: string;
};

export const mockProducts: Product[] = [
  // Electronics
  {
    productId: "PROD-001",
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    unitPrice: 19999, // $199.99
    stockCount: 45,
    available: true,
    imageEmoji: "🎧",
  },
  {
    productId: "PROD-002",
    name: "Smart Watch Pro",
    category: "Electronics",
    unitPrice: 14999,
    stockCount: 32,
    available: true,
    imageEmoji: "⌚",
  },
  {
    productId: "PROD-003",
    name: "USB-C Charging Cable 6ft",
    category: "Electronics",
    unitPrice: 1299,
    stockCount: 250,
    available: true,
    imageEmoji: "🔌",
  },
  {
    productId: "PROD-004",
    name: "Bluetooth Keyboard",
    category: "Electronics",
    unitPrice: 4999,
    stockCount: 0,
    available: false,
    imageEmoji: "⌨️",
  },
  {
    productId: "PROD-005",
    name: "Portable Power Bank 20000mAh",
    category: "Electronics",
    unitPrice: 3499,
    stockCount: 88,
    available: true,
    imageEmoji: "🔋",
  },

  // Apparel
  {
    productId: "PROD-006",
    name: "Classic Cotton T-Shirt",
    category: "Apparel",
    unitPrice: 1999,
    stockCount: 150,
    available: true,
    imageEmoji: "👕",
  },
  {
    productId: "PROD-007",
    name: "Running Sneakers",
    category: "Apparel",
    unitPrice: 7999,
    stockCount: 64,
    available: true,
    imageEmoji: "👟",
  },
  {
    productId: "PROD-008",
    name: "Winter Jacket",
    category: "Apparel",
    unitPrice: 12999,
    stockCount: 0,
    available: false,
    imageEmoji: "🧥",
  },
  {
    productId: "PROD-009",
    name: "Baseball Cap",
    category: "Apparel",
    unitPrice: 1599,
    stockCount: 120,
    available: true,
    imageEmoji: "🧢",
  },
  {
    productId: "PROD-010",
    name: "Leather Belt",
    category: "Apparel",
    unitPrice: 2999,
    stockCount: 43,
    available: true,
    imageEmoji: "👔",
  },

  // Books
  {
    productId: "PROD-011",
    name: "The Great Gatsby",
    category: "Books",
    unitPrice: 1299,
    stockCount: 75,
    available: true,
    imageEmoji: "📕",
  },
  {
    productId: "PROD-012",
    name: "JavaScript: The Good Parts",
    category: "Books",
    unitPrice: 2999,
    stockCount: 22,
    available: true,
    imageEmoji: "📗",
  },
  {
    productId: "PROD-013",
    name: "Cooking with Herbs",
    category: "Books",
    unitPrice: 1899,
    stockCount: 0,
    available: false,
    imageEmoji: "📘",
  },
  {
    productId: "PROD-014",
    name: "Science Fiction Anthology Vol. 3",
    category: "Books",
    unitPrice: 2499,
    stockCount: 38,
    available: true,
    imageEmoji: "📙",
  },

  // Home
  {
    productId: "PROD-015",
    name: "Ceramic Coffee Mug Set (4pc)",
    category: "Home",
    unitPrice: 2499,
    stockCount: 95,
    available: true,
    imageEmoji: "☕",
  },
  {
    productId: "PROD-016",
    name: "Indoor Plant - Succulent",
    category: "Home",
    unitPrice: 1499,
    stockCount: 112,
    available: true,
    imageEmoji: "🪴",
  },
  {
    productId: "PROD-017",
    name: "Desk Lamp with LED",
    category: "Home",
    unitPrice: 3999,
    stockCount: 0,
    available: false,
    imageEmoji: "💡",
  },
  {
    productId: "PROD-018",
    name: "Throw Pillow Cover",
    category: "Home",
    unitPrice: 1199,
    stockCount: 200,
    available: true,
    imageEmoji: "🛋️",
  },

  // Sports
  {
    productId: "PROD-019",
    name: "Yoga Mat Premium",
    category: "Sports",
    unitPrice: 3499,
    stockCount: 67,
    available: true,
    imageEmoji: "🧘",
  },
  {
    productId: "PROD-020",
    name: "Basketball Official Size",
    category: "Sports",
    unitPrice: 2799,
    stockCount: 55,
    available: true,
    imageEmoji: "🏀",
  },
  {
    productId: "PROD-021",
    name: "Tennis Racket Pro",
    category: "Sports",
    unitPrice: 8999,
    stockCount: 0,
    available: false,
    imageEmoji: "🎾",
  },
  {
    productId: "PROD-022",
    name: "Water Bottle Insulated 32oz",
    category: "Sports",
    unitPrice: 2199,
    stockCount: 135,
    available: true,
    imageEmoji: "💧",
  },
  {
    productId: "PROD-023",
    name: "Resistance Bands Set",
    category: "Sports",
    unitPrice: 1999,
    stockCount: 88,
    available: true,
    imageEmoji: "🏋️",
  },
];
