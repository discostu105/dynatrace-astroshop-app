export interface Product {
  id: string;
  name: string;
  category: "Electronics" | "Apparel" | "Home & Garden" | "Sports" | "Books";
  price: number;
  stock: number;
  status: "In Stock" | "Out of Stock";
  emoji: string;
}

export interface ProductFilters {
  searchTerm: string;
  category: string;
  stockFilter: "all" | "in-stock" | "out-of-stock";
}

export interface ProductStatistics {
  totalProducts: number;
  available: number;
  outOfStock: number;
}
