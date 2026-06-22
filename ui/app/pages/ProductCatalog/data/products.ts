export interface Product {
  id: string;
  name: string;
  category: "Electronics" | "Apparel" | "Home & Garden";
  price: number;
  stock: number;
  icon: string;
}

export const PRODUCTS: Product[] = [
  // Electronics (10 products)
  {
    id: "prod-001",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 79.99,
    stock: 45,
    icon: "🎧",
  },
  {
    id: "prod-002",
    name: "Smart Watch",
    category: "Electronics",
    price: 199.99,
    stock: 12,
    icon: "⌚",
  },
  {
    id: "prod-003",
    name: "USB-C Cable",
    category: "Electronics",
    price: 14.99,
    stock: 200,
    icon: "🔌",
  },
  {
    id: "prod-004",
    name: "Laptop Stand",
    category: "Electronics",
    price: 49.99,
    stock: 0,
    icon: "💻",
  },
  {
    id: "prod-005",
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    stock: 88,
    icon: "🔊",
  },
  {
    id: "prod-006",
    name: "Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    stock: 23,
    icon: "⌨️",
  },
  {
    id: "prod-007",
    name: "Webcam",
    category: "Electronics",
    price: 89.99,
    stock: 7,
    icon: "📷",
  },
  {
    id: "prod-008",
    name: "USB Hub",
    category: "Electronics",
    price: 34.99,
    stock: 67,
    icon: "🔌",
  },
  {
    id: "prod-009",
    name: "Monitor",
    category: "Electronics",
    price: 399.99,
    stock: 8,
    icon: "🖥️",
  },
  {
    id: "prod-010",
    name: "Portable SSD",
    category: "Electronics",
    price: 109.99,
    stock: 0,
    icon: "💾",
  },

  // Apparel (8 products)
  {
    id: "prod-011",
    name: "Cotton T-Shirt",
    category: "Apparel",
    price: 19.99,
    stock: 150,
    icon: "👕",
  },
  {
    id: "prod-012",
    name: "Running Shoes",
    category: "Apparel",
    price: 89.99,
    stock: 34,
    icon: "👟",
  },
  {
    id: "prod-013",
    name: "Winter Jacket",
    category: "Apparel",
    price: 129.99,
    stock: 0,
    icon: "🧥",
  },
  {
    id: "prod-014",
    name: "Baseball Cap",
    category: "Apparel",
    price: 24.99,
    stock: 75,
    icon: "🧢",
  },
  {
    id: "prod-015",
    name: "Denim Jeans",
    category: "Apparel",
    price: 59.99,
    stock: 42,
    icon: "👖",
  },
  {
    id: "prod-016",
    name: "Hoodie",
    category: "Apparel",
    price: 49.99,
    stock: 0,
    icon: "🧥",
  },
  {
    id: "prod-017",
    name: "Sneakers",
    category: "Apparel",
    price: 79.99,
    stock: 28,
    icon: "👟",
  },
  {
    id: "prod-018",
    name: "Dress Shirt",
    category: "Apparel",
    price: 44.99,
    stock: 18,
    icon: "👔",
  },

  // Home & Garden (7 products)
  {
    id: "prod-019",
    name: "Coffee Maker",
    category: "Home & Garden",
    price: 79.99,
    stock: 15,
    icon: "☕",
  },
  {
    id: "prod-020",
    name: "Desk Lamp",
    category: "Home & Garden",
    price: 39.99,
    stock: 0,
    icon: "💡",
  },
  {
    id: "prod-021",
    name: "Throw Pillow",
    category: "Home & Garden",
    price: 24.99,
    stock: 60,
    icon: "🛋️",
  },
  {
    id: "prod-022",
    name: "Plant Pot",
    category: "Home & Garden",
    price: 14.99,
    stock: 90,
    icon: "🪴",
  },
  {
    id: "prod-023",
    name: "Kitchen Scale",
    category: "Home & Garden",
    price: 29.99,
    stock: 35,
    icon: "⚖️",
  },
  {
    id: "prod-024",
    name: "Candle Set",
    category: "Home & Garden",
    price: 19.99,
    stock: 80,
    icon: "🕯️",
  },
  {
    id: "prod-025",
    name: "Bamboo Cutting Board",
    category: "Home & Garden",
    price: 34.99,
    stock: 22,
    icon: "🔪",
  },
];

export const getProductStats = () => {
  const totalProducts = PRODUCTS.length;
  const availableProducts = PRODUCTS.filter((p) => p.stock > 0).length;
  const outOfStockProducts = PRODUCTS.filter((p) => p.stock === 0).length;

  return {
    totalProducts,
    availableProducts,
    outOfStockProducts,
  };
};
