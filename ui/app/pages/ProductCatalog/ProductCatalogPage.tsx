import React, { useState, useMemo } from "react";
import { Flex } from "@dynatrace/strato-components/layouts";
import { ProductHeader } from "./components/ProductHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductsTable } from "./components/ProductsTable";
import { PRODUCTS, getProductStats } from "./data/products";

export const ProductCatalogPage = () => {
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockFilter, setSelectedStockFilter] = useState("all");

  // Calculate product statistics for header metrics
  const stats = getProductStats();

  // Memoized filtering to avoid recalculating on every render
  const filteredProducts = useMemo(() => {
    let filtered = [...PRODUCTS];

    // Search by product name or category
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Stock availability filter
    if (selectedStockFilter === "inStock") {
      filtered = filtered.filter((product) => product.stock > 0);
    } else if (selectedStockFilter === "outOfStock") {
      filtered = filtered.filter((product) => product.stock === 0);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedStockFilter]);

  // Placeholder for product editing — would open a modal or navigate to edit page
  const handleEditProduct = (productId: string) => {
    // TODO: Implement product editing functionality
  };

  return (
    <Flex
      flexDirection="column"
      style={{
        height: "100%",
        backgroundColor: "var(--dt-colors-background-container-default)",
      }}
    >
      <ProductHeader
        totalProducts={stats.totalProducts}
        availableProducts={stats.availableProducts}
        outOfStockProducts={stats.outOfStockProducts}
      />

      <ProductFilters
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedStockFilter={selectedStockFilter}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onStockFilterChange={setSelectedStockFilter}
      />

      <div style={{ flex: 1, overflow: "auto", padding: "16px 24px" }}>
        <ProductsTable
          products={filteredProducts}
          onEditProduct={handleEditProduct}
        />
      </div>
    </Flex>
  );
};
