import React, { useState, useMemo } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProductHeader } from "./components/ProductHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductsTable, Product } from "./components/ProductsTable";

const MOCK_PRODUCTS: Product[] = [
  // Electronics (8 products)
  { id: "1", name: "Wireless Headphones", category: "Electronics", price: 79.99, stock: 45, icon: "🎧" },
  { id: "2", name: "Smart Watch", category: "Electronics", price: 199.99, stock: 12, icon: "⌚" },
  { id: "3", name: "USB-C Cable", category: "Electronics", price: 14.99, stock: 200, icon: "🔌" },
  { id: "4", name: "Laptop Stand", category: "Electronics", price: 49.99, stock: 0, icon: "💻" },
  { id: "5", name: "Bluetooth Speaker", category: "Electronics", price: 59.99, stock: 88, icon: "🔊" },
  { id: "6", name: "Webcam HD", category: "Electronics", price: 89.99, stock: 23, icon: "📷" },
  { id: "7", name: "Mechanical Keyboard", category: "Electronics", price: 129.99, stock: 15, icon: "⌨️" },
  { id: "8", name: "USB Hub", category: "Electronics", price: 34.99, stock: 0, icon: "🔌" },
  // Apparel (6 products)
  { id: "9", name: "Cotton T-Shirt", category: "Apparel", price: 19.99, stock: 150, icon: "👕" },
  { id: "10", name: "Running Shoes", category: "Apparel", price: 89.99, stock: 34, icon: "👟" },
  { id: "11", name: "Winter Jacket", category: "Apparel", price: 129.99, stock: 0, icon: "🧥" },
  { id: "12", name: "Baseball Cap", category: "Apparel", price: 24.99, stock: 78, icon: "🧢" },
  { id: "13", name: "Yoga Pants", category: "Apparel", price: 44.99, stock: 56, icon: "👖" },
  { id: "14", name: "Wool Socks", category: "Apparel", price: 12.99, stock: 200, icon: "🧦" },
  // Home & Garden (4 products)
  { id: "15", name: "Scented Candle", category: "Home & Garden", price: 16.99, stock: 92, icon: "🕯️" },
  { id: "16", name: "Throw Pillow", category: "Home & Garden", price: 29.99, stock: 44, icon: "🛋️" },
  { id: "17", name: "Plant Pot", category: "Home & Garden", price: 22.99, stock: 0, icon: "🪴" },
  { id: "18", name: "Garden Hose", category: "Home & Garden", price: 39.99, stock: 18, icon: "🌿" },
  // Sports (4 products)
  { id: "19", name: "Yoga Mat", category: "Sports", price: 34.99, stock: 62, icon: "🧘" },
  { id: "20", name: "Resistance Bands", category: "Sports", price: 19.99, stock: 110, icon: "💪" },
  { id: "21", name: "Water Bottle", category: "Sports", price: 27.99, stock: 85, icon: "🍶" },
  { id: "22", name: "Dumbbell Set", category: "Sports", price: 149.99, stock: 0, icon: "🏋️" },
  // Books (3 products)
  { id: "23", name: "React Mastery", category: "Books", price: 39.99, stock: 32, icon: "📚" },
  { id: "24", name: "Design Thinking", category: "Books", price: 29.99, stock: 47, icon: "📖" },
  { id: "25", name: "Data Science 101", category: "Books", price: 44.99, stock: 21, icon: "📊" },
];

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  // Compute statistics from FULL mock list (not filtered)
  const totalProducts = MOCK_PRODUCTS.length;
  const availableProducts = MOCK_PRODUCTS.filter(p => p.stock > 0).length;
  const outOfStockProducts = MOCK_PRODUCTS.filter(p => p.stock === 0).length;

  // Filter products based on current filter state
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Search filter (case-insensitive)
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (category !== "all" && product.category !== category) {
        return false;
      }

      // Status filter
      if (status === "in-stock" && product.stock === 0) {
        return false;
      }
      if (status === "out-of-stock" && product.stock > 0) {
        return false;
      }

      return true;
    });
  }, [searchTerm, category, status]);

  return (
    <Flex flexDirection="column" style={{ height: "100%", backgroundColor: "var(--dt-colors-background-container-default)" }}>
      <ProductHeader 
        totalProducts={totalProducts}
        availableProducts={availableProducts}
        outOfStockProducts={outOfStockProducts}
      />
      <ProductFilters 
        searchTerm={searchTerm}
        category={category}
        status={status}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
      />
      <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
        <ProductsTable products={filteredProducts} />
      </div>
    </Flex>
  );
};
