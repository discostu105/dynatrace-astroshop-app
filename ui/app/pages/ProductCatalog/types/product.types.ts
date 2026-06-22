export type ProductCategory =
  | "Electronics"
  | "Apparel"
  | "Home & Garden"
  | "Sports"
  | "Books";
export type ProductStatus = "in-stock" | "out-of-stock";

export interface Product {
  id: string;
  name: string;
  emoji: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
}
