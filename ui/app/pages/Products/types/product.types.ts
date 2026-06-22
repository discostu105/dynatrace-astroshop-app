export interface Product {
  id: string;
  name: string;
  icon: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
}

export interface ProductStatistics {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
}

export type ProductCategory =
  | "All Categories"
  | "Electronics"
  | "Apparel"
  | "Sports"
  | "Kitchen"
  | "Office"
  | "Home";

export type ProductStatusFilter = "All Products" | "In Stock" | "Out of Stock";
